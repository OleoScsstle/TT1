from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone 
import datetime

# --- Modelo Administrador ---
class Administrador(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='administrador_perfil')
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    correo = models.EmailField(unique=True)

    def __str__(self):
        return f"Admin: {self.nombre} {self.apellido}"

# --- Modelo Especialista (Medico) ---
class Medico(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='medico_perfil')
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    correo = models.EmailField(unique=True) 
    cedula = models.CharField(max_length=50, unique=True)
    especialidad = models.CharField(max_length=100)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    
    ESTADO_VALIDACION_CHOICES = [
        ('PENDIENTE', 'Pendiente'),
        ('APROBADO', 'Aprobado'),
        ('RECHAZADO', 'Rechazado'),
    ]
    estado_validacion = models.CharField(
        max_length=10,
        choices=ESTADO_VALIDACION_CHOICES,
        default='PENDIENTE',
    )
    admin_validador = models.ForeignKey(
        Administrador,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='especialistas_validados'
    )

    def __str__(self):
        return f"Dr. {self.nombre} {self.apellido}"

# --- Modelo Paciente ---
class Paciente(models.Model):
    esp_encargado = models.ForeignKey(Medico, on_delete=models.CASCADE, related_name="pacientes")

    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    fecha_nac = models.DateField()
    # Default hoy para evitar problemas al crear
    fecha_ingreso = models.DateField(default=datetime.date.today, null=True, blank=True)

    SEXO_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('O', 'Otro'),
    ]
    sexo = models.CharField(max_length=1, choices=SEXO_CHOICES)
    correo = models.EmailField(blank=True, null=True)
    imagen_perfil = models.ImageField(upload_to='perfiles_pacientes/', blank=True, null=True)
    historial_medico = models.TextField(blank=True, null=True)
    
    ESTADO_PACIENTE_CHOICES = [
        ('ACTIVO', 'Activo'),
        ('INACTIVO', 'Inactivo'),
    ]
    estado = models.CharField(
        max_length=10,
        choices=ESTADO_PACIENTE_CHOICES,
        default='ACTIVO',
    )

    def __str__(self):
        return f"Paciente: {self.nombre} {self.apellido}"

# --- Modelo Cita ---
class Cita(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='citas')
    fecha_hora = models.DateTimeField() # Campo clave para fecha y hora
    motivo = models.TextField(blank=True, null=True)
    creada_en = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Cita con {self.paciente.nombre} el {self.fecha_hora.strftime('%Y-%m-%d %H:%M')}"

# --- Modelo Análisis de Imagen (RENOMBRADO Y AJUSTADO) ---
class AnalisisImagen(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name="analisis")
    # Opcional: Relación con médico si la necesitas explícita, pero ya está en paciente
    # especialista = models.ForeignKey(Medico, on_delete=models.CASCADE, related_name="analisis_realizados")
    
    titulo = models.CharField(max_length=255, blank=True, null=True) # Agregado para el frontend
    imagen = models.ImageField(upload_to='analisis_imagenes/', blank=True, null=True) 
    
    # Cambiado a DateTimeField con auto_now_add para consistencia
    fecha_analisis = models.DateTimeField(auto_now_add=True) 
    
    resultado = models.TextField(blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Análisis de {self.paciente.nombre} ({self.fecha_analisis})"