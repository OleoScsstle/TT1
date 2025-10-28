from django.urls import path
from .views import MedicoCreateView
from .views import MedicoCreateView, UserProfileView

urlpatterns = [
    # Esta será la URL /api/register/
    path('register/', MedicoCreateView.as_view(), name='register_medico'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
]