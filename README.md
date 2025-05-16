# Task Management System API

A RESTful API for managing tasks and users with role-based access control. Administrators can create, assign, update, and delete tasks, while members can view and update their assigned tasks.

---

## Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Environment Variables](#environment-variables)
5. [Running the Server](#running-the-server)
6. [Authentication](#authentication)
   - [Roles](#roles)
   - [JWT Tokens](#jwt-tokens)
7. [API Endpoints](#api-endpoints)
   - [User Endpoints](#user-endpoints)
     - [Register User](#register-user)
     - [Verify OTP](#verify-otp)
     - [Resend OTP](#resend-otp)
     - [Login User](#login-user)
     - [Request Password Reset](#request-password-reset)
     - [Verify Reset Password OTP](#verify-reset-password-otp)
     - [Get All Users](#get-all-users)
   - [Task Endpoints](#task-endpoints)
     - [Create Task](#create-task)
     - [Get All Tasks](#get-all-tasks)
     - [Update Task](#update-task)
     - [Delete Task](#delete-task)
8. [Error Handling](#error-handling)
9. [License](#license)

---

## Features

- User registration with OTP verification.
- Role-based access control (`Admin` and `Member` roles).
- JWT-based authentication.
- Task management (create, update, delete, and view tasks).
- Email notifications for task assignments, updates, and completions.

---

## Prerequisites

- Node.js v14+ installed.
- MongoDB database (local or cloud).

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/dotunoflagos/
   cd task-management-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

---

## Environment Variables

Create a `.env` file in the project root with the following variables:
---

```properties
DB_URI=<your_mongodb_connection_string>
PORT=3000
USR=<your_email_address>
PASS=<your_email_password>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRATION=1h
JWT_REFRESH_SECRET=<your_jwt_refresh_secret>
JWT_REFRESH_EXPIRATION=30d
```

---
### Setting Up Nodemailer with Gmail

To enable email functionality (e.g., OTP verification, password reset), the API uses **Nodemailer** with Gmail. Follow these steps to configure it:

  **If using a personal Gmail account**:
   - Go to your Google Account settings.
   - Navigate to **Security**.
   - Enable **2-Step Verification**.
   - Generate an **App Password** for your application. Use this password in the `.env` file as the value for `PASS`.

---
## Running the Server

Start the server with:

```bash
npm start
```

The server will run at `http://localhost:3000` by default.

---

## Authentication

### Roles

- **Admin**: Full access to all endpoints.
- **Member**: Limited access to assigned tasks.

### JWT Tokens

- **Access Token**: Used for authentication, stored as an HTTP-only cookie (`Auth`).
- **Refresh Token**: Used to renew access tokens.

---

## API Endpoints

### User Endpoints

#### Register User

- **URL**: `/api/v1/register`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:

  ```json
  {
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "phone": "123-456-7890",
    "username": "johndoe",
    "password": "Password1!",
    "role": "Member"
  }
  ```

  - **`role`**: Can take the following options:
    - `"Admin"`
    - `"Member"`

- **Success Response (201)**:

  ```json
  {
    "message": "Registration successful. Please check your email for the OTP.",
    "user": {
      "_id": "<userId>",
      "firstname": "John",
      "lastname": "Doe",
      "email": "john.doe@example.com"
    }
  }
  ```

---

#### Verify OTP

- **URL**: `/api/v1/verify-otp`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:

  ```json
  {
    "email": "john.doe@example.com",
    "otp": "123456"
  }
  ```

- **Success Response (200)**:

  ```json
  {
    "message": "OTP verified successfully"
  }
  ```

---

#### Resend OTP

- **URL**: `/api/v1/resend-otp`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:

  ```json
  {
    "email": "john.doe@example.com"
  }
  ```

- **Success Response (200)**:

  ```json
  {
    "message": "New OTP sent to your email"
  }
  ```

---

#### Login User

- **URL**: `/api/v1/login`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:

  ```json
  {
    "username": "johndoe",
    "password": "Password1!"
  }
  ```

- **Success Response (200)**:

  ```json
  {
    "message": "Logged in"
  }
  ```

---

#### Request Password Reset

- **URL**: `/api/v1/reset-password/request`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:

  ```json
  {
    "email": "john.doe@example.com"
  }
  ```

- **Success Response (200)**:

  ```json
  {
    "message": "New OTP sent to your email"
  }
  ```

---

#### Verify Reset Password OTP

- **URL**: `/api/v1/reset-password/verify`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:

  ```json
  {
    "username": "johndoe",
    "otp": "123456",
    "newPassword": "NewPass1!"
  }
  ```

- **Success Response (200)**:

  ```json
  {
    "message": "Password updated successfully"
  }
  ```

---

#### Get All Users

- **URL**: `/api/v1/allUsers`
- **Method**: `GET`
- **Access**: Admin Only
- **Success Response (200)**:

  ```json
  [
    { "_id": "<userId>", "email": "john.doe@example.com", "role": "Member" }
  ]
  ```

---

### Task Endpoints

#### Create Task

- **URL**: `/api/v1/tasks`
- **Method**: `POST`
- **Access**: Admin Only
- **Request Body**:

  ```json
  {
    "title": "Design Homepage",
    "description": "Create wireframes for homepage",
    "assignedTo": "<userId>",
    "dueDate": "2025-06-01",
    "priority": "High"
  }
  ```

  - **`priority`**: Can take the following options:
    - `"Low"`
    - `"Medium"`
    - `"High"`

- **Success Response (201)**:

  ```json
  {
    "_id": "<taskId>",
    "title": "Design Homepage",
    "description": "Create wireframes for homepage",
    "createdBy": "<adminId>",
    "assignedTo": "<userId>",
    "dueDate": "2025-06-01",
    "priority": "High"
  }
  ```

---

#### Get All Tasks

- **URL**: `/api/v1/tasks`
- **Method**: `GET`
- **Access**: Admin and Members
- **Query Parameters**:
  - **`status`** (optional): Can take the following options:
    - `"To-Do"`
    - `"In Progress"`
    - `"Done"`

- **Success Response (200)**:

  ```json
  [
    {
      "_id": "<taskId>",
      "title": "Design Homepage",
      "description": "Create wireframes for homepage",
      "assignedTo": { "_id": "<userId>", "name": "Doe John" },
      "status": "To-Do"
    }
  ]
  ```

---

#### Update Task

- **URL**: `/api/v1/tasks/:id`
- **Method**: `PUT`
- **Access**: Admin and Members
- **Request Body**:

  ```json
  {
    "title": "Design Landing Page",
    "status": "In Progress"
  }
  ```

  - **`status`**: Can take the following options:
    - `"To-Do"`
    - `"In Progress"`
    - `"Done"`

- **Success Response (200)**:

  ```json
  {
    "_id": "<taskId>",
    "title": "Design Landing Page",
    "status": "In Progress"
  }
  ```

---

#### Delete Task

- **URL**: `/api/v1/tasks/:id`
- **Method**: `DELETE`
- **Access**: Admin Only
- **Success Response (200)**:

  ```json
  { "message": "Task deleted" }
  ```

---

## Error Handling

Standard error responses use the following format:

```json
{
  "message": "Error description",
  "error": { ...optional details }
}
```

---

## License

This project is licensed under the MIT License.