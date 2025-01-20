# Task Management App

## Overview

A Full-stack Task Management application. The backend was built with ExpressJS, Sequelize, PostgresSql, and Redis, and containerized using Docker for efficient deployment and management, while the frontend was built with React.js, Material-UI, and axios was used for the API calls. This application supports secure user registration, login with authentication, and all the Task-related API calls are secured with JWT authentication. Redis caching was utilized for JWT token storing and retrieval (and invalidation); Redis cache was also used to access frequently accessed tasks.

## Features

- User Registration: Sign up new users with username and password and email.
- User Authentication: User login with token-based authentication.
- CRUD Operations for Tasks: Create, simple read, advanced search, update, and delete tasks associated with users.
- Input Validation: ensuring that the user-input data meets the desired format and is within sensible constraints.
- Redis Caching: Improves performance by caching frequently accessed tasks.
- Design Patterns: Implements Singleton for logs and Redis instance and Factory pattern for task creation.
- Dockerized Environment: Easily deployable using Docker and Docker Compose.
- Detailed logging of errors and user operations. The logger util service creates and manages log files inside the logs folder in the root directory.

## Requirements

- Node.js:18.
- Docker:27.3.1
- Postman or cURL for testing the endpoints
- React 19.0.0

## Getting Started 
-  Clone the Repository and navigate to the project directory
```bash
  git clone https://github.com/kusai99/task-management-app.git
 ```

-  Install npm dependencies 
```bash
  npm install
 ```
- Create a .env file in the root directory with the following environment variables:
  
    >DB_HOST=db
    DB_USER=root
  >
    >DB_PASSWORD=your_postgresSql_password
  >
   >DB_NAME=task_management_app
  >
   >DB_PORT=5432
  >
   >JWT_SECRET=your_jwt_secret
  >
   >REDIS_HOST=redis
  >
   >REDIS_PORT=6379

-  Make sure the values inside docker-compose.yml are set to the correct env variables inside .env
-  Run the following bash script, which composes down the server container and then composes it back up again.
  ```bash
  cd server
  ./server-redeploy.sh
 ```

 This command builds and runs all necessary backend services, including:
 - PostgresSQL for data storage and management.
 - Redis for caching.
 - The ExpressJS application.

-  navigate to the client folder to run the react app that consumes the API
  ```bash
  cd ../client
  npm start
 ```
 
- Open http://localhost:4001/login on your browser.
 

## API Documentation

###  User Endpoints
-  Register: POST: http://localhost:4000/api/auth/register
  
    Registers a new user.
-  Login: POST: http://localhost:4000/api/auth/login
  
    Authenticates a user and returns an authentication token.

###  Tasks Endpoints
-  Create Task:
-  POST: http://localhost:4000/api/tasks

    Creates a new task

-  Get All Tasks: GET: http://localhost:4000/api/tasks/

    Gets all the tasks associated with the authenticated user.
  
-  Get Specific Task: GET: http://localhost:4000/api/tasks/:id

    Gets a specific task for an authenticaetd user.
  
-  Search tasks with criteria: POST: http://localhost:4000/api/tasks/search

    Gets a list of tasks for the authenticated user based on search criteria.

-  Update Task: PUT http://localhost:4000/api/tasks/:id

    Updates a task by ID for the authenticated user.

-  Delete Task: DELETE http://localhost:4000/api/tasks/:id

    Deletes a task by ID for the authenticated user.
##  Database Design

The application uses the following schema:

-  Users  Table

      -  Stores user credentials and metadata.


-  Tasks Table

      - Stores Tasks information.
 
## Caching with Redis

Redis is used to store and retrieve the jwt token for at login, logout, and the Auth middleware. Redis was also used to cache frequently accessed tasks, improving performance for repeat requests. The caching mechanism is implemented on the Get All Tasks endpoint to reduce load on the database.

##  Design Patterns

-  Singleton Pattern: Ensures a single instance of the logger and Redis classes are used throughout the application.
-  Factory Method Pattern: Used to create instances of different types of tasks (e.g., personal, work). the TaskType enum is extendable.

##  Testing the API

Apart from using the frontend UI created, You can test the application using Postman or curl commands. Make sure to include the JWT token in the Authorization header for authenticated routes.

```bash
curl -X POST http://localhost:4000/api/auth/register -H "Content-Type: application/json" -d '{"username": "user1", "password": "@User111", "email" : "user1Email@email.com}'
```
