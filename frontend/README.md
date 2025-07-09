Task Manager Web App
A full-stack task management application designed to help users organize their daily tasks efficiently. This project showcases proficiency in modern web development, including robust backend API creation, dynamic frontend user interfaces, secure authentication, and seamless deployment across multiple platforms.

✨ Live Demo
Frontend (Vercel): [Your Vercel App URL Here](https://task-manager-app-inky-ten.vercel.app/)

Backend API (Render): [Your Render Backend URL Here](https://task-manager-backend-yd6l.onrender.com)

(Note: The backend API root URL will return a 404 as it's an API, but the endpoints are active.)

🚀 Features
User Authentication:

Secure user registration and login.

JSON Web Token (JWT) based authentication for API access.

User logout functionality.

Task Management (CRUD):

Create: Add new tasks with titles, descriptions, due dates, and initial status.

Read: View a personalized list of all tasks.

Update: Edit existing tasks, including title, description, due date, and status.

Delete: Remove tasks from the list.

Personalized Experience: Each user can only view and manage their own tasks.

Responsive Design: User interface adapts to various screen sizes (desktop, tablet, mobile).

🛠️ Technologies Used
Frontend
React: A JavaScript library for building user interfaces.

TypeScript: A typed superset of JavaScript that compiles to plain JavaScript, enhancing code quality and maintainability.

CSS: For custom styling and responsive design.

Backend
Django: A high-level Python web framework that encourages rapid development and clean, pragmatic design.

Django REST Framework (DRF): A powerful and flexible toolkit for building Web APIs on top of Django.

Django REST Framework Simple JWT: For handling JSON Web Token authentication.

Django CORS Headers: For managing Cross-Origin Resource Sharing (CORS) between the frontend and backend.

Gunicorn: A Python WSGI HTTP Server for UNIX, used for production deployment.

psycopg2-binary: PostgreSQL adapter for Python.

Database
PostgreSQL: A powerful, open-source object-relational database system.

Deployment
Vercel: For deploying the React frontend.

Render: For deploying the Django backend and hosting the PostgreSQL database.

⚙️ Local Development Setup
Follow these steps to get a local copy of the project up and running on your machine.

Prerequisites
Python 3.8+

Node.js (LTS recommended) & npm (or Yarn)

PostgreSQL installed and running locally

Git

1. Clone the Repository
git clone https://github.com/your-username/task-manager-web-app.git
cd task-manager-web-app

2. Backend Setup (Django)
Navigate into the backend directory:

cd backend

a. Create and Activate Virtual Environment
python -m venv venv
# On Linux/macOS
source venv/bin/activate
# On Windows (Command Prompt)
venv\Scripts\activate.bat
# On Windows (Git Bash/WSL)
source venv/Scripts/activate

b. Install Python Dependencies
pip install -r requirements.txt
# If requirements.txt is not present or outdated, generate it:
# pip install Django djangorestframework djangorestframework-simplejwt psycopg2-binary django-cors-headers gunicorn python-dotenv
# pip freeze > requirements.txt

c. PostgreSQL Database Configuration
Ensure your local PostgreSQL server is running.

Create a database:

CREATE DATABASE taskmanagerdb;

Create a user and grant privileges:

CREATE USER your_db_user WITH PASSWORD 'your_db_password';
GRANT ALL PRIVILEGES ON DATABASE taskmanagerdb TO your_db_user;
-- Also grant schema permissions if needed (run while connected to taskmanagerdb)
\c taskmanagerdb;
GRANT USAGE ON SCHEMA public TO your_db_user;
GRANT CREATE ON SCHEMA public TO your_db_user;

Replace your_db_user and your_db_password with your chosen credentials.

d. Environment Variables (.env)
Create a .env file in the backend/ directory (at the same level as manage.py) and populate it with your local database credentials and a secret key. Do NOT commit this file to Git.

# backend/.env
DJANGO_SECRET_KEY='your_local_django_secret_key_here'
DJANGO_DEBUG=True

DB_NAME='taskmanagerdb'
DB_USER='your_db_user'
DB_PASSWORD='your_db_password'
DB_HOST='localhost'
DB_PORT='5432'

CORS_ALLOWED_ORIGINS="http://localhost:3000"

e. Run Migrations
python manage.py migrate

f. Create a Superuser (for Django Admin)
python manage.py createsuperuser

g. Start the Backend Server
python manage.py runserver

The backend API will be available at http://127.0.0.1:8000/api/.

3. Frontend Setup (React)
Open a new terminal and navigate into the frontend directory:

cd ../frontend

a. Install Node.js Dependencies
npm install
# or yarn install

b. Environment Variables (.env.development)
Create a .env.development file in the frontend/ directory and point it to your local backend. Do NOT commit this file to Git.

# frontend/.env.development
REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api

c. Start the Frontend Development Server
npm start
# or yarn start

The frontend application will typically open in your browser at http://localhost:3000.

☁️ Deployment
The application is deployed using:

Frontend: Vercel (for the React application)

Backend: Render (for the Django REST Framework API and PostgreSQL database)

Environment variables for production are securely managed directly on Vercel and Render platforms, ensuring sensitive information is not exposed in the codebase.

🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check issues page.

📄 License
Distributed under the MIT License. See LICENSE for more information.

✉️ Contact
Your Name - your.email@example.com
Project Link: https://github.com/your-username/task-manager-web-app

🙏 Acknowledgements
Django Documentation

Django REST Framework Documentation

React Documentation

Vercel Documentation

Render Documentation