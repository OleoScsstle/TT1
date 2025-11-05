from rest_framework.routers import DefaultRouter
from django.urls import path, include
<<<<<<< HEAD
from .views import MedicoCreateView
from .views import MedicoCreateView, UserProfileView, PasswordResetRequestView, PasswordResetConfirmView, PacienteViewSet
=======
from rest_framework.routers import DefaultRouter
from .views import (
    MedicoCreateView,
    UserProfileView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    PacienteViewSet
)
>>>>>>> c6239f824d8a35d87d730ad1efdb6601791d2a18

router = DefaultRouter()
router.register(r'pacientes', PacienteViewSet, basename='paciente')

urlpatterns = [
    path('register/', MedicoCreateView.as_view(), name='register_medico'),  # 👈 viejo alias
    path('medico/crear/', MedicoCreateView.as_view(), name='crear_medico'), # 👈 nueva ruta
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('', include(router.urls)),
]
