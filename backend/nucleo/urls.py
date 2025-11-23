from rest_framework.routers import DefaultRouter
from django.urls import path, include

from .views import (
    MedicoCreateView,
    MedicoProfileUpdateView,
    UserProfileView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    PacienteViewSet,
    AdminMedicoViewSet,
    AdminPacienteViewSet
)

router = DefaultRouter()
router.register(r'pacientes', PacienteViewSet, basename='paciente')
router.register(r'admin/medicos', AdminMedicoViewSet, basename='admin-medicos')
router.register(r'admin/pacientes', AdminPacienteViewSet, basename='admin-pacientes')

urlpatterns = [
    path('register/', MedicoCreateView.as_view(), name='register_medico'),
    path('medico/crear/', MedicoCreateView.as_view(), name='crear_medico'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('medico/update/', MedicoProfileUpdateView.as_view(), name='medico_update'),
    path('', include(router.urls)),
]
