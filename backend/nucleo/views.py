from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Medico
from .serializers import MedicoSerializer, UserSerializer

class MedicoCreateView(generics.CreateAPIView):
    """
    Vista para crear un nuevo Medico (Especialista).
    No requiere autenticación (AllowAny).
    """
    queryset = Medico.objects.all()
    serializer_class = MedicoSerializer
    permission_classes = [AllowAny]

class UserProfileView(APIView):
    """
    Vista para obtener los datos del usuario actualmente logueado.
    Requiere autenticación.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user) # request.user contiene el usuario logueado
        return Response(serializer.data)