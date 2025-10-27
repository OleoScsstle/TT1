from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Medico
from .serializers import MedicoSerializer

class MedicoCreateView(generics.CreateAPIView):
    """
    Vista para crear un nuevo Medico (Especialista).
    No requiere autenticación (AllowAny).
    """
    queryset = Medico.objects.all()
    serializer_class = MedicoSerializer
    permission_classes = [AllowAny] # Permite que CUALQUIERA se pueda registrar