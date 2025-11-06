from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Medico, Paciente


# ============================================================
# 🔹 SERIALIZER: MÉDICO
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
        ]

    def create(self, validated_data):
        """
        Crea un usuario base y su perfil de médico enlazado.
        """
        password = validated_data.pop('password')
        correo = validated_data.get('correo')
        nombre = validated_data.get('nombre', '')
        apellido = validated_data.get('apellido', '')

        # ✅ Creamos el usuario en Django
        user = User.objects.create_user(
            username=correo,
            email=correo,
            password=password,
            first_name=nombre,
            last_name=apellido
        )

        # ✅ Creamos el médico asociado al usuario
        medico = Medico.objects.create(
            user=user,
            correo=correo,
            nombre=nombre,
            apellido=apellido,
            cedula=validated_data.get('cedula', ''),
            telefono=validated_data.get('telefono', ''),
            direccion=validated_data.get('direccion', ''),
            especialidad=validated_data.get('especialidad', '')
        )
        return medico


# ============================================================
# 🔹 SERIALIZER: USUARIO + PERFIL COMPLETO
# ============================================================
class UserSerializer(serializers.ModelSerializer):
    """
    Combina la información del usuario (User) y del médico (Medico)
    en una sola respuesta JSON.
    """
    medico_perfil = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'medico_perfil']

    def get_medico_perfil(self, obj):
        try:
            medico = Medico.objects.get(user=obj)
            return MedicoSerializer(medico).data
        except Medico.DoesNotExist:
            return None


# ============================================================
# 🔹 SERIALIZER: SOLICITUD DE RESETEO DE CONTRASEÑA
# ============================================================
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


# ============================================================
# 🔹 SERIALIZER: CONFIRMACIÓN DE RESETEO DE CONTRASEÑA
# ============================================================
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
# 🔹 SERIALIZER: PACIENTE
# ============================================================
class PacienteSerializer(serializers.ModelSerializer):
    esp_encargado = MedicoSerializer(read_only=True)

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
            #'fecha_ingreso',
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
