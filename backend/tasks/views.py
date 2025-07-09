# backend/tasks/views.py

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated # Ensures only logged-in users can access
from .models import Task # Import the Task model
from .serializers import TaskSerializer # Import the Task serializer

# TaskListCreateView
# This view handles two main functionalities:
# 1. Listing all tasks for the authenticated user (GET request).
# 2. Creating a new task for the authenticated user (POST request).
# It uses `generics.ListCreateAPIView` which combines these two operations.
class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer # The serializer to use for tasks
    
    # Permission class: `IsAuthenticated` means only users who are logged in
    # (i.e., provide a valid JWT in their request) can access this view.
    permission_classes = [IsAuthenticated]

    # Override `get_queryset` to ensure a user can only see their own tasks.
    # This is crucial for data privacy and security in a multi-user application.
    def get_queryset(self):
        # Filter tasks to only include those where the 'user' foreign key
        # matches the currently authenticated user (`self.request.user`).
        # Tasks are ordered by creation date in descending order (newest first).
        return Task.objects.filter(user=self.request.user).order_by('-created_at')

    # Override `perform_create` to automatically assign the task to the current user.
    # When a POST request comes in to create a task, the 'user' field should not
    # be provided by the client; it should be set by the backend based on who is logged in.
    def perform_create(self, serializer):
        # Save the serializer instance, automatically setting the 'user' field
        # of the new Task object to the authenticated user.
        serializer.save(user=self.request.user)

# TaskDetailView
# This view handles operations on a single task instance:
# 1. Retrieving a specific task (GET request).
# 2. Updating a specific task (PUT/PATCH requests).
# 3. Deleting a specific task (DELETE request).
# It uses `generics.RetrieveUpdateDestroyAPIView` which combines these operations.
class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer # The serializer to use for tasks
    
    # Permission class: Only authenticated users can access this view.
    permission_classes = [IsAuthenticated]
    
    # The base queryset from which to retrieve objects.
    # We start with all tasks, but `get_queryset` below will filter it further.
    queryset = Task.objects.all()

    # Override `get_queryset` again to ensure a user can only retrieve, update,
    # or delete tasks that they own. This provides object-level security.
    def get_queryset(self):
        # Filters the queryset to ensure the requested task belongs to the current user.
        # If a user tries to access a task ID that belongs to another user, this
        # filter will result in an empty queryset, leading to a 404 Not Found response.
        return Task.objects.filter(user=self.request.user)
