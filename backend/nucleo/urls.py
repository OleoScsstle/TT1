from django.urls import path, include
from .views import MedicoCreateView
from rest_framework.routers import DefaultRouter
from .views import MedicoCreateView, UserProfileView, PasswordResetRequestView, PasswordResetConfirmView, PacienteViewSet

router = DefaultRouter()
router.register(r'pacientes', PacienteViewSet, basename='paciente') # Registra '/api/pacientes/'

urlpatterns = [
    # Esta será la URL /api/register/
    path('register/', MedicoCreateView.as_view(), name='register_medico'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('', include(router.urls)),
]