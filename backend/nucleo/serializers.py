from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Medico, Paciente, Administrador # Asegúrate de importar todos los modelos

# ============================================================
# 🔹 SERIALIZER: MÉDICO (SOLO PARA REGISTRO - CREATE)
# ============================================================
class MedicoSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = Medico
        fields = [
            'password', 
            'correo', 
            'nombre', 
            'apellido', 
            'cedula', 
            'telefono', 
            'direccion', 
            'especialidad',
            'fecha_nacimiento' # <-- Correcto
        ]

    def create(self, validated_data):
        """
        Crea un usuario base y su perfil de médico enlazado.
        """
        user_data = {
            "username": validated_data['correo'],
            "email": validated_data['correo'],
            "password": validated_data.pop('password'), # Saca el password
            "first_name": validated_data.get('nombre', ''),
            "last_name": validated_data.get('apellido', '')
        }
        
        # 1. Creamos el User (con la contraseña encriptada)
        user = User.objects.create_user(**user_data)
        
        # 2. Creamos el Medico y lo conectamos al User
        # validated_data ya no tiene 'password', pero sí los otros campos
        medico = Medico.objects.create(user=user, **validated_data)
        
        return medico

# ============================================================
# 🔹 SERIALIZER: PERFIL DE MÉDICO (SOLO LECTURA - READ)
# ============================================================
class MedicoProfileSerializer(serializers.ModelSerializer):
    """
    Serializer de SOLO LECTURA para mostrar datos del médico.
    Usado en UserSerializer y PacienteSerializer.
    """
    class Meta:
        model = Medico
        fields = [
            'id',
            'nombre', 
            'apellido', 
            'cedula', 
            'especialidad', 
            'telefono', 
            'direccion', 
            'fecha_nacimiento' # <-- Campo añadido
        ]

# ============================================================
# 🔹 SERIALIZER: MÉDICO (SOLO PARA ACTUALIZAR - UPDATE)
# ============================================================
class MedicoUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer para actualizar el perfil del Médico (campos que pueden editar).
    """
    class Meta:
        model = Medico
        fields = [
            'nombre', 
            'apellido', 
            'telefono', 
            'direccion', 
            'fecha_nacimiento', 
            'especialidad'
        ]
        
        # Hacemos todos opcionales para que PATCH funcione
        extra_kwargs = {
            'nombre': {'required': False},
            'apellido': {'required': False},
            'telefono': {'required': False, 'allow_null': True, 'allow_blank': True},
            'direccion': {'required': False, 'allow_null': True, 'allow_blank': True},
            'fecha_nacimiento': {'required': False, 'allow_null': True},
            'especialidad': {'required': False},
        }

# ============================================================
# 🔹 SERIALIZER: USUARIO + PERFIL COMPLETO (READ)
# ============================================================
class UserSerializer(serializers.ModelSerializer):
    """
    Combina la información del usuario (User) y del médico (Medico)
    en una sola respuesta JSON para el /api/profile/
    """
    # --- CORRECCIÓN AQUÍ ---
    # Usamos el serializer de solo lectura que acabamos de crear
    medico_perfil = MedicoProfileSerializer(read_only=True) 

    class Meta:
        model = User
        # --- CORRECCIÓN AQUÍ ---
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'medico_perfil']
    
    # --- YA NO NECESITAMOS get_medico_perfil() ---


# ============================================================
# 🔹 SERIALIZER: RESETEO DE CONTRASEÑA (SIN CAMBIOS)
# ============================================================
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

class PasswordResetConfirmSerializer(serializers.Serializer):
    uidb64 = serializers.CharField(required=True)
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Las contraseñas no coinciden."})
        try:
            validate_password(attrs['new_password'])
        except ValidationError as e:
            raise serializers.ValidationError({"new_password": list(e.messages)})
        return attrs


# ============================================================
# 🔹 SERIALIZER: PACIENTE (CON CAMPO AÑADIDO)
# ============================================================
class PacienteSerializer(serializers.ModelSerializer):
    # Usamos el serializer de solo lectura para el médico
    esp_encargado = MedicoProfileSerializer(read_only=True)

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
            'imagen_perfil',
            'fecha_ingreso', # <-- Correcto
            'esp_encargado',
        ]
        extra_kwargs = {
            'telefono': {'required': False, 'allow_null': True, 'allow_blank': True},
            'direccion': {'required': False, 'allow_null': True, 'allow_blank': True},
            'correo': {'required': False, 'allow_null': True, 'allow_blank': True},
            'historial_medico': {'required': False, 'allow_null': True, 'allow_blank': True},
            'estado': {'required': False},
            'imagen_perfil': {'required': False, 'allow_null': True},
        }