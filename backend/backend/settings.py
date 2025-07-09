# backend/backend/settings.py

import os
from pathlib import Path
from datetime import timedelta # Import timedelta for JWT settings
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# You should replace 'your-secret-key-here' with a strong, randomly generated key.
# For production, it's best to load this from an environment variable.
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'ok1d_+am=23vx*ee^soid*4yk01d+iuq_ql_n9+*x!i(&ufcj#')

# SECURITY WARNING: don't run with debug turned on in production!
# Set DEBUG to False in production.
DEBUG = os.environ.get('DJANGO_DEBUG', 'True') == 'True'

# ALLOWED_HOSTS specifies a list of strings representing the host/domain names
# that this Django site can serve. In production, you'd list your domain names.
# For development, '127.0.0.1', 'localhost' are common. '*' allows all hosts (use ONLY for development/testing).
ALLOWED_HOSTS = ['127.0.0.1', 'localhost', 'postgresql://csadmin:GWcMRpQLOfHPXkSNBBmhBPgeXvplCZ9D@dpg-d1n1bbmuk2gs739dd1mg-a.virginia-postgres.render.com/taskmanagerdb_rjc6']
# For Vercel/Render/Heroku deployment, you'll add your frontend and backend URLs here later.
# Example: ALLOWED_HOSTS = ['your-frontend-domain.vercel.app', 'your-backend-domain.render.com', '127.0.0.1', 'localhost']


# Application definition

# INSTALLED_APPS lists all Django applications that are active in this project.
# Django comes with some default apps. We add our custom apps and DRF related apps.
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third-party apps
    'rest_framework', # Django REST Framework for building APIs
    'rest_framework_simplejwt', # For JSON Web Token authentication
    'corsheaders', # For handling Cross-Origin Resource Sharing (CORS) - crucial for frontend-backend communication

    # Our custom apps
    'users', # Our app for user authentication and profiles
    'tasks', # Our app for task management
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # For serving static files in production (add later if using WhiteNoise)
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware', # CORS middleware MUST be placed high in the list
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

# Configure PostgreSQL database connection.
# For local development, you might use 'django.db.backends.postgresql_psycopg2'
# For production, environment variables are highly recommended for security.
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2', # Use PostgreSQL engine
        'NAME': os.environ.get('DB_NAME', 'taskmanagerdb'), # Database name
        'USER': os.environ.get('DB_USER', 'csadmin'), # Database user
        'PASSWORD': os.environ.get('DB_PASSWORD', 'AnswrM3Questions3'), # Database password
        'HOST': os.environ.get('DB_HOST', 'localhost'), # Database host (e.g., 'localhost' or a remote IP)
        'PORT': os.environ.get('DB_PORT', '5432'), # Database port (default for PostgreSQL is 5432)
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'
# Add this for WhiteNoise if you decide to use it for static files in production
# STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
# STORAGES = {
#     "staticfiles": {
#         "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
#     },
# }


# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# Django REST Framework settings
# https://www.django-rest-framework.org/api-guide/settings/
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication', # Optional: For browsable API
        'rest_framework.authentication.BasicAuthentication', # Optional: For browsable API
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated', # Default to requiring authentication for all views
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10, # Number of items per page for paginated results
}

# Simple JWT settings
# https://django-rest-framework-simplejwt.readthedocs.io/en/latest/settings.html
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60), # How long access tokens are valid
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1), # How long refresh tokens are valid
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
    'UPDATE_LAST_LOGIN': False,

    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY, # Uses the project's SECRET_KEY for signing JWTs
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    'JWK_URL': None,
    'LEEWAY': 0,

    'AUTH_HEADER_TYPES': ('Bearer',), # How the token is sent in the header (e.g., Authorization: Bearer <token>)
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',

    'JTI_CLAIM': 'jti',

    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}


# CORS (Cross-Origin Resource Sharing) settings
# This is CRUCIAL for your React frontend to communicate with your Django backend.
# https://pypi.org/project/django-cors-headers/
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000", # Your React development server
    # Add your frontend's production URL here once deployed
    # "https://your-frontend-domain.vercel.app",
]
# Or, if you need to allow all origins during development (less secure, use with caution):
# CORS_ALLOW_ALL_ORIGINS = True
# If CORS_ALLOW_ALL_ORIGINS is True, CORS_ALLOWED_ORIGINS is ignored.
# For production, always use CORS_ALLOWED_ORIGINS with specific domains.

CORS_ALLOW_CREDENTIALS = True # Allow cookies/authentication headers to be sent with cross-origin requests

# Optional: If you need to allow specific methods or headers beyond defaults
# CORS_ALLOW_METHODS = [
#     'DELETE',
#     'GET',
#     'OPTIONS',
#     'PATCH',
#     'POST',
#     'PUT',
# ]

# CORS_ALLOW_HEADERS = [
#     'accept',
#     'accept-encoding',
#     'authorization',
#     'content-type',
#     'dnt',
#     'origin',
#     'user-agent',
#     'x-csrftoken',
#     'x-requested-with',
# ]

# backend/backend/settings.py

# ... (rest of your settings.py content) ...

# AUTH_USER_MODEL
# Specifies the custom user model to use for authentication.
# This must be set if you define a custom user model.
AUTH_USER_MODEL = 'users.CustomUser'