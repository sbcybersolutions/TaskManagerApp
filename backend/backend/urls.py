# backend/backend/urls.py

from django.contrib import admin
from django.urls import path, include # Import include for including other url configs

urlpatterns = [
    path('admin/', admin.site.urls), # Django Admin interface

    # Include API URLs from our apps under the 'api/' prefix.
    # This means all URLs defined in users/urls.py will start with 'api/users/',
    # and all URLs defined in tasks/urls.py will start with 'api/tasks/'.
        path('api/', include('users.urls')), # Include user authentication URLs
        path('api/', include('tasks.urls')), # Include task management URLs
    ]