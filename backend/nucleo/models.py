from django.db import models
from django.contrib.auth.models import User

# --- Modelo Administrador ---
class Administrador(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='administrador_perfil')
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    correo = models.EmailField(unique=True)

    def __str__(self):
        return f"Admin: {self.nombre} {self.apellido}"

# --- Modelo Especialista (Medico) ---
# Usamos 'Medico' para ser consistentes
class Medico(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='medico_perfil')
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    correo = models.EmailField(unique=True) 
    cedula = models.CharField(max_length=50, unique=True)

    especialidad = models.CharField(max_length=100)
    
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
        on_delete=models.SET_NULL, # Si se borra el admin, este campo se pone a NULL
        null=True, blank=True,
        related_name='especialistas_validados'
    )

    def __str__(self):
        return f"Dr. {self.nombre} {self.apellido}"

# --- Modelo Paciente ---
class Paciente(models.Model):
    # Foreign Key al Especialista (Esp_Encargado en tu diagrama)
    # ¡Esta es la clave para la separación de pacientes!
    esp_encargado = models.ForeignKey(Medico, on_delete=models.CASCADE, related_name="pacientes")

    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    fecha_nac = models.DateField()
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

# --- Modelo Análisis ---
class Analisis(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name="analisis")
    especialista = models.ForeignKey(Medico, on_delete=models.CASCADE, related_name="analisis_realizados")
    
    # Esto creará una carpeta 'backend/media/analisis_imagenes/'
    imagen = models.ImageField(upload_to='analisis_imagenes/', blank=True, null=True) 
    fecha = models.DateField()
    resultado = models.TextField()
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Análisis de {self.paciente.nombre} ({self.fecha})"

