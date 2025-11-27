from rest_framework import generics, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import serializers 
from rest_framework.decorators import action 
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings

# Importación de Modelos
from .models import Medico, Administrador, Paciente, Cita, AnalisisImagen

# Importación de Serializers
from .serializers import (
    MedicoSerializer,
    UserSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    PacienteSerializer,
    MedicoUpdateSerializer,
    MedicoProfileSerializer,
    CitaSerializer,          # <--- Asegúrate que esto está aquí
    AnalisisImagenSerializer # <--- Y esto también
)
from .serializers_jwt import MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# =========================================================================
# 🔹 VIEWSETS PRINCIPALES
# =========================================================================

# 1. PACIENTES
class PacienteViewSet(viewsets.ModelViewSet):
    serializer_class = PacienteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # El médico solo ve sus pacientes
        user = self.request.user
        if hasattr(user, 'medico_perfil'):
            return Paciente.objects.filter(esp_encargado=user.medico_perfil)
        return Paciente.objects.none()

    def perform_create(self, serializer):
        if hasattr(self.request.user, 'medico_perfil'):
            medico = self.request.user.medico_perfil
            serializer.save(esp_encargado=medico)
        else:
            raise serializers.ValidationError("No tienes un perfil de médico.")

# 2. CITAS (¡ESTA ES LA QUE FALTABA!)
class CitaViewSet(viewsets.ModelViewSet):
    serializer_class = CitaSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # El médico solo ve citas de sus pacientes
        user = self.request.user
        if hasattr(user, 'medico_perfil'):
            return Cita.objects.filter(paciente__esp_encargado=user.medico_perfil).order_by('-fecha_hora')
        return Cita.objects.none()

    def perform_create(self, serializer):
        paciente_id = self.request.data.get('paciente')
        try:
            # Verificar que el paciente pertenece al médico
            paciente = Paciente.objects.get(id=paciente_id, esp_encargado=self.request.user.medico_perfil)
        except Paciente.DoesNotExist:
            raise serializers.ValidationError("Paciente no encontrado o no asignado a este médico.")
            
        serializer.save(paciente=paciente)

# 3. ANÁLISIS DE IMAGEN
class AnalisisImagenViewSet(viewsets.ModelViewSet):
    serializer_class = AnalisisImagenSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'medico_perfil'):
            # Permite filtrar por paciente en la URL: ?paciente=1
            queryset = AnalisisImagen.objects.filter(paciente__esp_encargado=user.medico_perfil)
            paciente_id = self.request.query_params.get('paciente')
            if paciente_id:
                queryset = queryset.filter(paciente_id=paciente_id)
            return queryset
        return AnalisisImagen.objects.none()

# =========================================================================
# 🔹 VISTAS DE USUARIO Y PERFIL
# =========================================================================

class MedicoCreateView(generics.CreateAPIView):
    queryset = Medico.objects.all()
    serializer_class = MedicoSerializer
    permission_classes = [AllowAny]

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class MedicoProfileUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = MedicoUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        if hasattr(self.request.user, 'medico_perfil'):
            return self.request.user.medico_perfil
        return None 

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

# =========================================================================
# 🔹 VISTAS DE ADMINISTRACIÓN
# =========================================================================

class AdminMedicoViewSet(viewsets.ModelViewSet):
    serializer_class = MedicoProfileSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        estado = self.request.query_params.get('estado')
        if estado:
            return Medico.objects.filter(estado_validacion=estado)
        return Medico.objects.all()

    @action(detail=True, methods=['patch'])
    def validar(self, request, pk=None):
        medico = self.get_object()
        nuevo_estado = request.data.get('estado')
        if nuevo_estado in ['APROBADO', 'RECHAZADO']:
            medico.estado_validacion = nuevo_estado
            medico.save()
            return Response({'detail': f'Médico {nuevo_estado.lower()}.'})
        return Response({'detail': 'Estado inválido.'}, status=status.HTTP_400_BAD_REQUEST)

class AdminPacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all().order_by('-id')
    serializer_class = PacienteSerializer
    permission_classes = [IsAdminUser]
    http_method_names = ['get', 'delete', 'head', 'options']

# =========================================================================
# 🔹 VISTAS DE AUTENTICACIÓN (Password Reset & Token)
# =========================================================================

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
            return Response({"detail": "Si existe, se envió el correo."}, status=status.HTTP_200_OK)

        token = default_token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        reset_url = f"http://localhost:3000/reset-password/{uidb64}/{token}"
        
        # Aquí deberías configurar tu envío de correo real
        # send_mail(...) 
        
        return Response({"detail": "Enlace enviado."}, status=status.HTTP_200_OK)

class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Lógica de confirmación (igual que antes)
        return Response({"detail": "Contraseña restablecida."}, status=status.HTTP_200_OK)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer