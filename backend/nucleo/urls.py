from django.urls import path
from .views import MedicoCreateView
from .views import MedicoCreateView, UserProfileView, PasswordResetRequestView, PasswordResetConfirmView

urlpatterns = [
    # Esta será la URL /api/register/
    path('register/', MedicoCreateView.as_view(), name='register_medico'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]