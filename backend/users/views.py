# backend/users/views.py

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny # Allows unauthenticated access
from rest_framework_simplejwt.views import TokenObtainPairView # Base view for JWT token generation

from .serializers import UserRegistrationSerializer, MyTokenObtainPairSerializer

# UserRegistrationView
# This view handles the creation of new user accounts.
# It uses Django REST Framework's `generics.CreateAPIView` which is designed
# for handling POST requests to create a new instance of a model.
class UserRegistrationView(generics.CreateAPIView):
    # The serializer class to use for validating and deserializing input,
    # and for serializing output.
    serializer_class = UserRegistrationSerializer
    
    # Permission classes define who can access this view.
    # `AllowAny` means that any user, authenticated or not, can access this endpoint.
    # This is necessary for users to register without being logged in.
    permission_classes = [AllowAny]

    # Override the default `create` method to customize the response.
    # By default, `CreateAPIView` returns the created object's data.
    # We want to return a simple success message.
    def create(self, request, *args, **kwargs):
        # Get the serializer instance with the request data.
        serializer = self.get_serializer(data=request.data)
        
        # Validate the serializer data. If validation fails, `raise_exception=True`
        # will automatically return a 400 Bad Request response with error details.
        serializer.is_valid(raise_exception=True)
        
        # Perform the actual creation of the user. This calls the `create` method
        # defined in `UserRegistrationSerializer`.
        self.perform_create(serializer)
        
        # Get success headers (e.g., Location header for the newly created resource).
        headers = self.get_success_headers(serializer.data)
        
        # Return a custom success response with HTTP 201 Created status.
        return Response(
            {"message": "User registered successfully."},
            status=status.HTTP_201_CREATED,
            headers=headers
        )

# MyTokenObtainPairView (Customized JWT Login View)
# This view handles user login requests. When a user provides valid credentials,
# it returns an access token and a refresh token.
# It extends Simple JWT's `TokenObtainPairView` to leverage its built-in logic
# for token generation, but uses our custom serializer to include additional user data
# in the token payload.
class MyTokenObtainPairView(TokenObtainPairView):
    # The serializer class to use for handling token generation.
    # Our `MyTokenObtainPairSerializer` adds username and email to the token payload.
    serializer_class = MyTokenObtainPairSerializer