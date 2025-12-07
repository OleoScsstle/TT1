from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed # <--- Importante para lanzar el error de bloqueo

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Añadir datos personalizados al token (payload)
        token['username'] = user.username
        token['is_staff'] = user.is_staff
        
        return token

    def validate(self, attrs):
        # 1. Validación estándar (usuario y contraseña correctos)
        data = super().validate(attrs)

        # 2. BLOQUEO DE MÉDICOS NO VALIDADOS
        # Verificamos si el usuario es un médico
        if hasattr(self.user, 'medico_perfil'):
            perfil = self.user.medico_perfil
            
            # Caso 1: Pendiente
            if perfil.estado_validacion == 'PENDIENTE':
                raise AuthenticationFailed(
                    detail="Tu cuenta está en proceso de validación. Un administrador debe aprobarte antes de poder ingresar.",
                    code="account_pending"
                )
            
            # Caso 2: Rechazado
            if perfil.estado_validacion == 'RECHAZADO':
                raise AuthenticationFailed(
                    detail="Tu solicitud de registro ha sido rechazada por el administrador.",
                    code="account_rejected"
                )

        # 3. Si pasa las validaciones (o es Admin/Paciente), agregamos datos extra a la respuesta
        data['username'] = self.user.username
        data['is_staff'] = self.user.is_staff
        data['es_medico'] = hasattr(self.user, 'medico_perfil')

        return data