from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Medico

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
    class Meta:
        model = User
        # Define los campos que quieres enviar a React
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        # Puedes añadir más campos si los necesitas, como 'is_staff'