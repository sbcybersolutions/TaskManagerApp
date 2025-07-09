# backend/users/urls.py

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView # Import for refreshing tokens
from .views import UserRegistrationView, MyTokenObtainPairView

urlpatterns = [
    # URL for user registration.
    # When a POST request is made to 'api/register/', it will be handled by UserRegistrationView.
    path('register/', UserRegistrationView.as_view(), name='register'),

    # URL for user login (obtaining access and refresh tokens).
    # When a POST request is made to 'api/token/', it will be handled by MyTokenObtainPairView.
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # URL for refreshing an access token using a refresh token.
    # When a POST request is made to 'api/token/refresh/', it will be handled by TokenRefreshView.
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]