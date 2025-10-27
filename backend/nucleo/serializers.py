from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Medico

class MedicoSerializer(serializers.ModelSerializer):
    # Añadimos un campo 'password' que solo será para escribir (no se mostrará)
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
        # 1. Sacamos los datos para el 'User' y el 'Medico'
        # Usamos el correo como 'username' para el sistema de login
        user_data = {
            "username": validated_data['correo'],
            "email": validated_data['correo'],
            "password": validated_data['password']
        }
        
        # 2. Creamos el User (con la contraseña encriptada)
        # Usamos create_user() para asegurar que la contraseña se guarde (hasheada)
        user = User.objects.create_user(**user_data)
        
        # 3. Preparamos los datos para el 'Medico'
        # Quitamos los campos que ya usamos para el 'User'
        validated_data.pop('password')
        
        # 4. Creamos el Medico y lo conectamos al User
        medico = Medico.objects.create(user=user, **validated_data)
        
        return medico