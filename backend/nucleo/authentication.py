from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist

class EmailOrUsernameBackend(BaseBackend):
    """
    Este backend permite al usuario iniciar sesión
    usando su email o su username.
    """
    
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            # 1. Intenta buscar un usuario que coincida con el email
            user = User.objects.get(email=username)
        except ObjectDoesNotExist:
            try:
                # 2. Si no lo encuentra, intenta buscar por username
                user = User.objects.get(username=username)
            except ObjectDoesNotExist:
                # 3. Si no encuentra ninguno, no regresa nada.
                return None

        # 4. Si encontró un usuario, verifica su contraseña
        if user.check_password(password):
            return user # ¡Login exitoso!

        # 5. Si la contraseña es incorrecta
        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None