# backend/users/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models

# CustomUser Model
# It's recommended to use a custom user model from the start,
# even if it initially just extends Django's AbstractUser.
# This provides flexibility to add custom fields later (e.g., profile_picture, phone_number)
# without complex migrations.
class CustomUser(AbstractUser):
    # Add any additional fields here if you need them in the future.
    # For now, we're just extending AbstractUser without adding new fields,
    # but having this custom model gives us the flexibility to do so later.
    # For example:
    # phone_number = models.CharField(max_length=15, blank=True, null=True)
    # profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    # You can add a related_name to avoid clashes if you have multiple foreign keys
    # pointing to the User model from other models.
    # For example, if you later add a 'manager' field to a team, and it's also a CustomUser.
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.username