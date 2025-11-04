from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Medico
from .models import Paciente

class MedicoSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = Medico
        # Lista de campos que React nos enviará
        fields = [
            'password', 
            'correo', 
            'nombre', 
            'apellido', 
            'cedula', 
            'telefono', 
            'direccion', 
            'especialidad'
            # El 'estado_validacion' y 'admin_validador' se quedan con su valor por defecto
        ]

    def create(self, validated_data):

        user_data = {
            "username": validated_data['correo'],
            "email": validated_data['correo'],
            "password": validated_data['password']
        }
        
        user = User.objects.create_user(**user_data)
        
        validated_data.pop('password')
        
        medico = Medico.objects.create(user=user, **validated_data)
        
        return medico
    
class UserSerializer(serializers.ModelSerializer):
    medico_perfil = MedicoSerializer(read_only=True)

    class Meta:
        model = User
        
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'medico_perfil']
        

class PasswordResetRequestSerializer(serializers.Serializer):
    """
    Serializer para validar el correo electrónico al solicitar
    restablecimiento de contraseña.
    """
    email = serializers.EmailField(required=True)

class PasswordResetConfirmSerializer(serializers.Serializer):
    """
    Serializer para validar el token, uidb64 y la nueva contraseña
    al confirmar el restablecimiento.
    """
    uidb64 = serializers.CharField(required=True)
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})

    def validate(self, attrs):
        # Valida que las contraseñas coincidan
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Las contraseñas no coinciden."})

        # Valida la fortaleza de la contraseña usando los validadores de Django
        try:
            validate_password(attrs['new_password'])
        except ValidationError as e:
            raise serializers.ValidationError({"new_password": list(e.messages)})

        return attrs
    

class PacienteSerializer(serializers.ModelSerializer):
    esp_encargado = MedicoSerializer(read_only=True) # El médico se asigna en la vista

    class Meta:
        model = Paciente
        fields = [
            'id', 
            'nombre', 
            'apellido', 
            'telefono', 
            'direccion', 
            'fecha_nac', 
            'sexo', 
            'correo', 
            'estado',
            'historial_medico',
            'imagen_perfil', # <-- Añadimos el nuevo campo real
            'esp_encargado',
        ]
        # Hacemos opcionales los campos que no son 100% requeridos
        extra_kwargs = {
            'telefono': {'required': False, 'allow_null': True, 'allow_blank': True},
            'direccion': {'required': False, 'allow_null': True, 'allow_blank': True},
            'correo': {'required': False, 'allow_null': True, 'allow_blank': True},
            'historial_medico': {'required': False, 'allow_null': True, 'allow_blank': True},
            'estado': {'required': False},
            'imagen_perfil': {'required': False, 'allow_null': True}, # <-- Marcamos la imagen como opcional
        }