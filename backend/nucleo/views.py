from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import Medico
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str 
from django.contrib.auth import get_user_model
from .serializers import MedicoSerializer, UserSerializer
from .serializers import PasswordResetRequestSerializer
from .serializers import PasswordResetConfirmSerializer

class MedicoCreateView(generics.CreateAPIView):
    """
    Vista para crear un nuevo Medico (Especialista).
    No requiere autenticación (AllowAny).
    """
    queryset = Medico.objects.all()
    serializer_class = MedicoSerializer
    permission_classes = [AllowAny]

class UserProfileView(APIView):
    """
    Vista para obtener los datos del usuario actualmente logueado.
    Requiere autenticación.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user) # request.user contiene el usuario logueado
        return Response(serializer.data)

class PasswordResetRequestView(generics.GenericAPIView):
    """
    Vista para solicitar el restablecimiento de contraseña.
    Recibe un correo y envía un email con el enlace de reseteo.
    """
    serializer_class = PasswordResetRequestSerializer
    permission_classes = [AllowAny] 

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:

            return Response({"detail": "Si existe una cuenta asociada a este correo, se ha enviado un enlace para restablecer la contraseña."}, status=status.HTTP_200_OK)

        token = default_token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

        reset_url = f"http://localhost:3000/reset-password/{uidb64}/{token}"

        subject = "Restablecimiento de contraseña"
        message = f"Hola {user.username},\n\n" \
                  f"Haz clic en el siguiente enlace para restablecer tu contraseña:\n" \
                  f"{reset_url}\n\n" \
                  f"Si no solicitaste esto, ignora este correo.\n"

        try:
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
            print(f"--- Correo de restablecimiento simulado para {user.email} ---")
            print(f"Asunto: {subject}")
            print(f"Mensaje:\n{message}")
            print("---------------------------------------------------------")
        except Exception as e:
             print(f"Error simulando envío de correo: {e}")
             return Response({"detail": "Error al procesar la solicitud."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        return Response({"detail": "Si existe una cuenta asociada a este correo, se ha enviado un enlace para restablecer la contraseña."}, status=status.HTTP_200_OK)

class PasswordResetConfirmView(generics.GenericAPIView):
    """
    Vista para confirmar el restablecimiento de contraseña.
    Recibe uidb64, token y la nueva contraseña.
    """
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [AllowAny] # Cualquiera puede intentar confirmar

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        uidb64 = serializer.validated_data['uidb64']
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']

        try:
            # Decodificar uidb64 para obtener el ID de usuario
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = get_user_model().objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, get_user_model().DoesNotExist):
            user = None

        # Verificar el usuario y el token
        if user is not None and default_token_generator.check_token(user, token):
            # Si todo es válido, establecer la nueva contraseña
            user.set_password(new_password) # set_password se encarga de hashear
            user.save()
            return Response({"detail": "Contraseña restablecida con éxito."}, status=status.HTTP_200_OK)
        else:
            # Si el usuario no existe o el token es inválido
            return Response({"detail": "El enlace de restablecimiento es inválido o ha expirado."}, status=status.HTTP_400_BAD_REQUEST)