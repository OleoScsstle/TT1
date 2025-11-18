from rest_framework import generics, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.decorators import action 
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import serializers # <-- Importante para la validación

# Asegúrate de importar TODOS los modelos que usas
from .models import Medico, Administrador, Paciente 

from .serializers import (
    MedicoSerializer,
    UserSerializer, # El serializer que ya contiene el perfil del médico
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    PacienteSerializer,
    MedicoUpdateSerializer, # El serializer específico para actualizar
    MedicoProfileSerializer
)

# ===============================
# 🔹 CREAR NUEVO MÉDICO
# ===============================
class MedicoCreateView(generics.CreateAPIView):
    queryset = Medico.objects.all()
    serializer_class = MedicoSerializer
    permission_classes = [AllowAny]


# ===============================
# 🔹 PERFIL DE USUARIO AUTENTICADO (¡CORREGIDO!)
# ===============================
class UserProfileView(APIView):
    """
    Vista para obtener los datos del usuario actualmente logueado.
    Usa UserSerializer, que ya incluye el MedicoProfileSerializer anidado.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # UserSerializer (de serializers.py) se encarga de todo
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


# ===============================
# 🔹 SOLICITAR RESTABLECIMIENTO DE CONTRASEÑA
# ===============================
class PasswordResetRequestView(generics.GenericAPIView):
    serializer_class = PasswordResetRequestSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"detail": "Si existe una cuenta asociada a este correo, se ha enviado un enlace para restablecer la contraseña."},
                status=status.HTTP_200_OK
            )

        token = default_token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        reset_url = f"http://localhost:3000/reset-password/{uidb64}/{token}"

        subject = "Restablecimiento de contraseña"
        message = f"Hola {user.username},\n\nHaz clic en el siguiente enlace para restablecer tu contraseña:\n{reset_url}\n\nSi no solicitaste esto, ignora este correo.\n"

        try:
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
            # print(f"Correo de restablecimiento enviado a {user.email}") # Opcional
        except Exception as e:
            # print(f"Error enviando correo: {e}") # Opcional
            return Response({"detail": "Error al procesar la solicitud."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(
            {"detail": "Si existe una cuenta asociada a este correo, se ha enviado un enlace para restablecer la contraseña."},
            status=status.HTTP_200_OK
        )


# ===============================
# 🔹 CONFIRMAR RESTABLECIMIENTO DE CONTRASEÑA
# ===============================
class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        uidb64 = serializer.validated_data['uidb64']
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = get_user_model().objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, get_user_model().DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({"detail": "Contraseña restablecida con éxito."}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "El enlace de restablecimiento es inválido o ha expirado."}, status=status.HTTP_400_BAD_REQUEST)


# ===============================
# 🔹 PACIENTES POR MÉDICO AUTENTICADO
# ===============================
class PacienteViewSet(viewsets.ModelViewSet):
    serializer_class = PacienteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'medico_perfil'):
            return Paciente.objects.filter(esp_encargado=user.medico_perfil)
        return Paciente.objects.none()

    def perform_create(self, serializer):
        if hasattr(self.request.user, 'medico_perfil'):
            medico = self.request.user.medico_perfil
            serializer.save(esp_encargado=medico)
        else:
            raise serializers.ValidationError("No tienes un perfil de médico para asignar pacientes.")


# ===============================
# 🔹 ACTUALIZAR PERFIL DE MÉDICO (¡CORREGIDO!)
# ===============================
# Reemplazamos tu MedicoUpdateView por esta, que usa la lógica correcta de DRF
class MedicoProfileUpdateView(generics.RetrieveUpdateAPIView):
    """
    Permite al médico logueado ver (GET) y
    actualizar (PATCH) su propio perfil.
    """
    serializer_class = MedicoUpdateSerializer # <-- Usa el serializer de ACTUALIZACIÓN
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Devuelve el perfil de médico del usuario logueado
        if hasattr(self.request.user, 'medico_perfil'):
            return self.request.user.medico_perfil
        return None # Opcional: raise Http404 si prefieres
            
    def get(self, request, *args, **kwargs):
        # Maneja peticiones GET
        return self.retrieve(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        # Maneja peticiones PATCH (actualización parcial)
        return self.partial_update(request, *args, **kwargs)

class AdminMedicoViewSet(viewsets.ModelViewSet):
    """
    Permite al administrador ver médicos.
    Soporta filtrar por estado: ?estado=PENDIENTE o ?estado=APROBADO
    """
    serializer_class = MedicoProfileSerializer
    permission_classes = [IsAdminUser] # Solo admins

    def get_queryset(self):
        # Obtenemos el parámetro 'estado' de la URL
        estado = self.request.query_params.get('estado')
        
        # Si nos piden un estado específico (ej. APROBADO), filtramos por eso
        if estado:
            return Medico.objects.filter(estado_validacion=estado)
        
        # Si no especifican nada, devolvemos todos (o podrías dejar PENDIENTE por defecto)
        return Medico.objects.all()

    @action(detail=True, methods=['patch'])
    def validar(self, request, pk=None):
        # ... (esta función se queda igual que antes) ...
        medico = self.get_object()
        nuevo_estado = request.data.get('estado')
        if nuevo_estado in ['APROBADO', 'RECHAZADO']:
            medico.estado_validacion = nuevo_estado
            medico.save()
            return Response({'detail': f'Médico {nuevo_estado.lower()} con éxito.'}, status=status.HTTP_200_OK)
        return Response({'detail': 'Estado inválido.'}, status=status.HTTP_400_BAD_REQUEST)

# 2. AÑADIMOS ESTA NUEVA CLASE
class AdminPacienteViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Vista de solo lectura para que el admin vea TODOS los pacientes del sistema.
    """
    queryset = Paciente.objects.all().order_by('-id') # Ordenados por el más reciente
    serializer_class = PacienteSerializer
    permission_classes = [IsAdminUser]