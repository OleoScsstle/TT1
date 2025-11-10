from rest_framework import generics, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from .models import Medico, Administrador, Paciente
from .serializers import (
    MedicoSerializer,
    UserSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    PacienteSerializer,
)

# ===============================
# 🔹 CREAR NUEVO MÉDICO
# ===============================
class MedicoCreateView(generics.CreateAPIView):
    queryset = Medico.objects.all()
    serializer_class = MedicoSerializer
    permission_classes = [AllowAny]


# ===============================
# 🔹 PERFIL DE USUARIO AUTENTICADO
# ===============================
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Verificamos si el usuario tiene perfil de médico
        medico_data = None
        if hasattr(user, 'medico_perfil'):
            medico_data = MedicoSerializer(user.medico_perfil).data

        # Serializamos los datos del usuario
        user_data = UserSerializer(user).data

        return Response({
            "user": user_data,
            "medico_perfil": medico_data
        })


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
            print(f"Correo de restablecimiento simulado para {user.email}")
        except Exception as e:
            print(f"Error simulando envío de correo: {e}")
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
# 🔹 ACTUALIZAR PERFIL DE MÉDICO
# ===============================
class MedicoUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user

        if not hasattr(user, 'medico_perfil'):
            return Response(
                {"detail": "El usuario autenticado no tiene perfil de médico."},
                status=status.HTTP_400_BAD_REQUEST
            )

        medico = user.medico_perfil

        nombre = request.data.get('nombre')
        apellido = request.data.get('apellido')

        if nombre:
            user.first_name = nombre
        if apellido:
            user.last_name = apellido
        user.save()

        serializer = MedicoSerializer(medico, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"detail": "Perfil actualizado correctamente.", "medico": serializer.data},
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
