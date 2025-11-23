from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Añadir datos personalizados al token (payload)
        token['username'] = user.username
        token['is_staff'] = user.is_staff
        # Puedes añadir más cosas si quieres, como el ID del médico

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Añadir datos extra a la RESPUESTA JSON (lo que recibe React)
        data['username'] = self.user.username
        data['is_staff'] = self.user.is_staff # <-- ¡ESTO ES LO QUE NECESITAMOS!
        
        # Verificamos si tiene perfil médico
        data['es_medico'] = hasattr(self.user, 'medico_perfil')

        return data