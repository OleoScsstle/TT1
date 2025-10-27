from django.urls import path
from .views import MedicoCreateView

urlpatterns = [
    # Esta será la URL /api/register/
    path('register/', MedicoCreateView.as_view(), name='register_medico'),
]