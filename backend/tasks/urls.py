# backend/tasks/urls.py

from django.urls import path
from .views import TaskListCreateView, TaskDetailView

urlpatterns = [
    # URL for listing all tasks and creating a new task.
    # GET request to 'api/tasks/' will list tasks.
    # POST request to 'api/tasks/' will create a new task.
    path('tasks/', TaskListCreateView.as_view(), name='task-list-create'),

    # URL for retrieving, updating, or deleting a specific task by its ID (primary key).
    # GET request to 'api/tasks/<id>/' will retrieve a task.
    # PUT/PATCH request to 'api/tasks/<id>/' will update a task.
    # DELETE request to 'api/tasks/<id>/' will delete a task.
    # <int:pk> is a path converter that captures an integer and passes it as 'pk' to the view.
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
]