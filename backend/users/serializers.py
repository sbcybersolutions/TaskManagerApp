# backend/users/serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model # Recommended way to get the active user model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# Get the custom user model defined in settings.py (users.CustomUser)
User = get_user_model()

# UserRegistrationSerializer
# This serializer is used for creating new user accounts.
class UserRegistrationSerializer(serializers.ModelSerializer):
    # password2 field is added for password confirmation during registration.
    # It's a write-only field, meaning it will be accepted on input but not returned on output.
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User # Specifies that this serializer is for our CustomUser model
        # Fields to include in the serialization/deserialization.
        # 'password' and 'password2' are write-only for security.
        fields = ['username', 'email', 'password', 'password2']
        # Extra arguments for fields, e.g., making password write-only and min length.
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 8}
        }

    # Custom validation for the entire serializer.
    # This method is called after individual field validations.
    def validate(self, attrs):
        # Check if passwords match
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    # Custom create method to handle user creation and password hashing.
    # This method is called when serializer.is_valid() and serializer.save() are called.
    def create(self, validated_data):
        # Remove password2 as it's not a model field
        validated_data.pop('password2')
        # Create the user instance using the create_user method, which handles password hashing
        user = User.objects.create_user(**validated_data)
        return user

# MyTokenObtainPairSerializer
# Extends Simple JWT's default TokenObtainPairSerializer to include username and email
# in the token response, alongside access and refresh tokens.
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims (e.g., username, email) to the token payload
        token['username'] = user.username
        token['email'] = user.email
        # You can add more user-specific data here if needed

        return token