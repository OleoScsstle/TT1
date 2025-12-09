from rest_framework import generics, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import serializers 
from rest_framework.decorators import action 
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework.parsers import MultiPartParser, FormParser 
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from django.http import HttpResponse
from django.template.loader import get_template
import requests  # <--- IMPORTANTE: Para conectar con FastAPI
from datetime import date
from xhtml2pdf import pisa
import os
import re

# Importación de Modelos
from .models import Medico, Administrador, Paciente, Cita, AnalisisImagen

# Importación de Serializers
from .serializers import (
    MedicoSerializer,
    UserSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    PacienteSerializer,
    MedicoUpdateSerializer,
    MedicoProfileSerializer,
    CitaSerializer,
    AnalisisImagenSerializer
)
from .serializers_jwt import MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# =========================================================================
# 🔹 VIEWSETS PRINCIPALES
# =========================================================================

# 1. PACIENTES
class PacienteViewSet(viewsets.ModelViewSet):
    serializer_class = PacienteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # El médico solo ve sus pacientes
        user = self.request.user
        if hasattr(user, 'medico_perfil'):
            return Paciente.objects.filter(esp_encargado=user.medico_perfil)
        return Paciente.objects.none()

    def perform_create(self, serializer):
        if hasattr(self.request.user, 'medico_perfil'):
            medico = self.request.user.medico_perfil
            serializer.save(esp_encargado=medico)
        else:
            raise serializers.ValidationError("No tienes un perfil de médico.")

# 2. CITAS
class CitaViewSet(viewsets.ModelViewSet):
    serializer_class = CitaSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # El médico solo ve citas de sus pacientes
        user = self.request.user
        if hasattr(user, 'medico_perfil'):
            return Cita.objects.filter(paciente__esp_encargado=user.medico_perfil).order_by('-fecha_hora')
        return Cita.objects.none()

    def perform_create(self, serializer):
        paciente_id = self.request.data.get('paciente')
        try:
            # Verificar que el paciente pertenece al médico
            paciente = Paciente.objects.get(id=paciente_id, esp_encargado=self.request.user.medico_perfil)
        except Paciente.DoesNotExist:
            raise serializers.ValidationError("Paciente no encontrado o no asignado a este médico.")
            
        serializer.save(paciente=paciente)

# 3. ANÁLISIS DE IMAGEN (CON INTEGRACIÓN DE IA)
class AnalisisImagenViewSet(viewsets.ModelViewSet):
    serializer_class = AnalisisImagenSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'medico_perfil'):
            # Permite filtrar por paciente en la URL: ?paciente=1
            queryset = AnalisisImagen.objects.filter(paciente__esp_encargado=user.medico_perfil)
            paciente_id = self.request.query_params.get('paciente')
            if paciente_id:
                queryset = queryset.filter(paciente_id=paciente_id)
            return queryset
        return AnalisisImagen.objects.none()

    def perform_create(self, serializer):
        # 1. Obtener al médico logueado
        if not hasattr(self.request.user, 'medico_perfil'):
             raise serializers.ValidationError("Solo los médicos pueden realizar análisis.")
        
        medico = self.request.user.medico_perfil
        
        # 2. Obtener la imagen
        imagen_obj = self.request.FILES.get('imagen')
        if not imagen_obj:
            raise serializers.ValidationError("No se proporcionó ninguna imagen.")

        # ============================================================
        # 🔹 CONEXIÓN CON TU MICROSERVICIO DE IA (FastAPI)
        # ============================================================
        resultado_ia = "Error en análisis"
        descripcion_ia = "No se pudo conectar con el motor de IA."
        
        try:
            # Preparamos el archivo para enviarlo a FastAPI
            files = {'file': (imagen_obj.name, imagen_obj.read(), imagen_obj.content_type)}
            
            # Petición POST a tu API corriendo en el puerto 8001
            response = requests.post('http://localhost:8001/predict', files=files)
            
            if response.status_code == 200:
                data = response.json()
                
                diag = data.get('diagnostico', 'Indeterminado')
                prob = data.get('probabilidad_malignidad', 0)
                conf = data.get('confianza', '0%')
                modelo = data.get('modelo', 'IA')
                
                # Formateamos el resultado para guardarlo en la BD
                resultado_ia = f"{diag.upper()} ({conf})"
                descripcion_ia = (
                    f"Diagnóstico sugerido: {diag}.\n"
                    f"Probabilidad de malignidad: {prob}\n"
                    f"Modelo utilizado: {modelo}"
                )
            else:
                descripcion_ia = f"Error del modelo IA: {response.text}"

        except Exception as e:
            print(f"Error de conexión con IA: {e}")
            descripcion_ia = "El servicio de IA no está disponible en este momento."

        # Restauramos el puntero del archivo para que Django pueda guardarlo
        imagen_obj.seek(0)

        # 3. Guardar en la BD
        serializer.save(
            #especialista=medico,
            #fecha=date.today(),
            resultado=resultado_ia,
            descripcion=descripcion_ia
        )

# =========================================================================
# 🔹 VISTAS DE USUARIO Y PERFIL
# =========================================================================

class MedicoCreateView(generics.CreateAPIView):
    queryset = Medico.objects.all()
    serializer_class = MedicoSerializer
    permission_classes = [AllowAny]

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class MedicoProfileUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = MedicoUpdateSerializer
    permission_classes = [IsAuthenticated]

    parser_classes = [MultiPartParser, FormParser]
    def get_object(self):
        if hasattr(self.request.user, 'medico_perfil'):
            return self.request.user.medico_perfil
        return None 

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

# =========================================================================
# 🔹 VISTAS DE ADMINISTRACIÓN
# =========================================================================

class AdminMedicoViewSet(viewsets.ModelViewSet):
    serializer_class = MedicoProfileSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        estado = self.request.query_params.get('estado')
        if estado:
            return Medico.objects.filter(estado_validacion=estado)
        return Medico.objects.all()

    @action(detail=True, methods=['patch'])
    def validar(self, request, pk=None):
        medico = self.get_object()
        nuevo_estado = request.data.get('estado')
        if nuevo_estado in ['APROBADO', 'RECHAZADO']:
            medico.estado_validacion = nuevo_estado
            medico.save()
            return Response({'detail': f'Médico {nuevo_estado.lower()}.'})
        return Response({'detail': 'Estado inválido.'}, status=status.HTTP_400_BAD_REQUEST)

class AdminPacienteViewSet(viewsets.ModelViewSet): # <--- CAMBIO: ModelViewSet permite borrar
    queryset = Paciente.objects.all().order_by('-id')
    serializer_class = PacienteSerializer
    permission_classes = [IsAdminUser]
    # Quitamos la restricción de http_method_names para permitir DELETE

# =========================================================================
# 🔹 VISTAS DE AUTENTICACIÓN (Password Reset & Token)
# =========================================================================

class PasswordResetRequestView(generics.GenericAPIView):
    serializer_class = PasswordResetRequestSerializer
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "Si existe una cuenta asociada, se envió un enlace."}, status=status.HTTP_200_OK)

        # Generar Tokens
        token = default_token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Link de recuperación
        reset_url = f"http://localhost:3000/reset-password/{uidb64}/{token}"
        
        # Diseño de correo rosa
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fce4ec; margin: 0; padding: 0; }}
                .container {{ max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 0; border-radius: 12px; box-shadow: 0 4px 15px rgba(233, 30, 99, 0.2); overflow: hidden; }}
                .header {{ background-color: #e91e63; color: #ffffff; padding: 30px 20px; text-align: center; }}
                .content {{ padding: 30px; text-align: center; color: #333333; line-height: 1.6; }}
                .button {{ display: inline-block; padding: 14px 28px; background-color: #e91e63; color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: bold; margin-top: 20px; font-size: 16px; box-shadow: 0 4px 6px rgba(233, 30, 99, 0.3); }}
                .button:hover {{ background-color: #c2185b; }}
                .footer {{ background-color: #f8bbd0; padding: 15px; text-align: center; font-size: 12px; color: #880e4f; }}
                .link-text {{ margin-top: 30px; font-size: 11px; color: #888; word-break: break-all; border-top: 1px solid #eee; padding-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2 style="margin:0;">Restablecer Contraseña</h2>
                </div>
                <div class="content">
                    <p>Hola, <strong>{user.username}</strong>.</p>
                    <p>Hemos recibido una solicitud para cambiar tu contraseña. Si fuiste tú, haz clic en el botón de abajo:</p>
                    <a href="{reset_url}" class="button" style="color: #ffffff;">Cambiar mi Contraseña</a>
                    <div class="link-text">
                        <p>¿El botón no funciona? Copia y pega el siguiente enlace en tu navegador:</p>
                        <p>{reset_url}</p>
                    </div>
                </div>
                <div class="footer">
                    <p>&copy; 2025 Tu Plataforma Médica. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>
        """

        text_content = f"Hola. Usa este enlace para resetear tu password: {reset_url}"

        try:
            send_mail(
                subject='Restablecer tu contraseña',
                message=text_content,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                fail_silently=False,
                html_message=html_content
            )
        except Exception as e:
            print(f"Error enviando correo: {e}")
            return Response({"detail": "Error al enviar el correo."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({"detail": "Enlace enviado correctamente."}, status=status.HTTP_200_OK)

class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({"detail": "Contraseña restablecida."}, status=status.HTTP_200_OK)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class GenerarPDFView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            analisis = AnalisisImagen.objects.get(pk=pk)
        except AnalisisImagen.DoesNotExist:
            return Response({"error": "Análisis no encontrado"}, status=404)

        # Preparar ruta de imagen
        imagen_path = ""
        nombre_archivo = "Desconocido"
        if analisis.imagen:
            imagen_path = os.path.join(settings.MEDIA_ROOT, str(analisis.imagen))
            nombre_archivo = os.path.basename(str(analisis.imagen)) # Extrae solo "foto.jpg"

        # Calcular edad
        edad = "---"
        if analisis.paciente.fecha_nac:
            today = date.today()
            born = analisis.paciente.fecha_nac
            edad = today.year - born.year - ((today.month, today.day) < (born.month, born.day))

        # --- INTELIGENCIA PARA EXTRAER DATOS DEL TEXTO ---
        # Como guardamos todo en un string en 'descripcion', vamos a intentar leerlo
        # Formato esperado: "Diagnóstico: X\nConfianza: 98%\nScore: 0.98..."
        descripcion = analisis.descripcion or ""
        
        # Valores por defecto
        probabilidad = "N/A"
        confianza = "N/A"

        # Buscamos "Score: 0.xxxx" o "Probabilidad: 0.xxxx"
        match_prob = re.search(r'(Score|Probabilidad).*?(\d+\.\d+)', descripcion)
        if match_prob:
            probabilidad = match_prob.group(2)

        # Buscamos "Confianza: 98%"
        match_conf = re.search(r'Confianza.*?(\d+\.?\d*%)', descripcion)
        if match_conf:
            confianza = match_conf.group(1)

        context = {
            'analisis': analisis,
            'imagen_path': imagen_path,
            'nombre_archivo': nombre_archivo,
            'edad': edad,
            'probabilidad': probabilidad,
            'confianza': confianza,
            'fecha_impresion': date.today().strftime("%d/%m/%Y")
        }

        # Renderizar
        template_path = 'reporte_analisis.html'
        template = get_template(template_path)
        html = template.render(context)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="Reporte_MapeoRosa_{pk}.pdf"'

        pisa_status = pisa.CreatePDF(html, dest=response)

        if pisa_status.err:
            return HttpResponse('Error generando PDF', status=500)
        return response