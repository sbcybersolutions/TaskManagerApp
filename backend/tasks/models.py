# backend/tasks/models.py

from django.db import models
from django.conf import settings # Import settings to access AUTH_USER_MODEL

# Task Model
# Represents a single task in the task manager application.
class Task(models.Model):
    # Foreign Key to the CustomUser model.
    # Each task is associated with a specific user.
    # settings.AUTH_USER_MODEL ensures we're referencing the correct user model,
    # whether it's Django's default or our custom one.
    # on_delete=models.CASCADE means if a user is deleted, all their tasks are also deleted.
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tasks')

    # Title of the task. Max length is 255 characters.
    title = models.CharField(max_length=255)

    # Optional description for the task. Can be blank and null.
    description = models.TextField(blank=True, null=True)

    # Due date for the task. Optional.
    due_date = models.DateField(blank=True, null=True)

    # Status of the task. We'll use choices for predefined options.
    # Default status is 'pending'.
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('deferred', 'Deferred'),
        ('cancelled', 'Cancelled'),
    ]
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
    )

    # Automatically sets the creation timestamp when the task is first created.
    created_at = models.DateTimeField(auto_now_add=True)

    # Automatically updates the timestamp every time the task is saved.
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # Orders tasks by creation date by default, newest first.
        ordering = ['-created_at']
        verbose_name = 'Task'
        verbose_name_plural = 'Tasks'

    def __str__(self):
        # String representation of a Task object, useful for admin and debugging.
        return f"{self.title} ({self.user.username})"