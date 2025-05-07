
# CineMate - Web Application

CineMate is a web application that allows users to manage their favorite movies and TV series, create a watchlist, rate content, and receive personalized recommendations. The application is built using a **React** frontend and a **Spring Boot** backend with **MongoDB** for data storage.

## Table of Contents
1. [Technologies](#technologies)
2. [Backend - Spring Boot](#backend---spring-boot)
3. [Frontend - React](#frontend---react)
4. [Installation](#installation)
5. [API Endpoints](#api-endpoints)
6. [Future Features](#future-features)

## Technologies

- **Frontend**: React, Axios, React Router
- **Backend**: Spring Boot, MongoDB, Spring Security, JWT
- **Database**: MongoDB (NoSQL)
- **Authentication**: JSON Web Token (JWT)

## Backend - Spring Boot

### Setup

1. Ensure you have **Java 11** or higher and **Maven** installed.
2. Clone the repository and navigate to the backend directory.
3. Set up a MongoDB database (either locally or via a cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).
4. Modify the `application.properties` (or `application.yml`) to configure the MongoDB connection:

```properties
spring.data.mongodb.uri=mongodb://localhost:27017/cinemate
```

5. Build and run the Spring Boot backend:

```bash
mvn spring-boot:run
```

6. The backend will be available at `http://localhost:8080`.

### API Endpoints

#### **Authentication**
- `POST /api/auth/register`: Register a new user
  - Request Body: `{ "username": "user", "email": "email@example.com", "password": "password123" }`
  - Response: 200 OK or 400 if username already exists

- `POST /api/auth/login`: Login a user and receive a JWT token
  - Request Body: `{ "username": "user", "password": "password123" }`
  - Response: JWT token on success, 401 if credentials are invalid

#### **User Data**
- `GET /api/users/me` or `GET /api/users/{id}`: Get user details of the currently logged in user with /me (protected endpoint, requires JWT) or a specific user by his id.
  - Response: User data (e.g., username, email, watchlist)

## Frontend - React

### Setup

1. Ensure you have **Node.js** and **npm** installed.
2. Clone the repository and navigate to the frontend directory.
3. Install dependencies:

```bash
npm install
```

4. Start the React development server:

```bash
npm start
```

5. The frontend will be available at `http://localhost:3000`.

### Features
- **Login**: Users can log in with their credentials and get a JWT token for further requests.
- **Register**: Users can create a new account.
- **ExplorePage**: All movies and series currently in the database are displayed on the explore page.
- **MovieDetail**: Each movie has a detail page with all attributes like description, releaseDate etc. Additionally reviews are displayed.
- **MovieDetail**: Each movie has a detail page with all attributes like description, releaseDate etc. Additionally all seasons and episodes of a series and reviews are displayed.
- **Watchlist**: Users can view and manage their movie/TV show watchlist.
-  **UserProfile**: Users can view and manage their profile with a bio and a profile picture they can add.
-  **Calender**: A calender where all future releases of movies and series are displayed.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/cinemate.git
cd cinemate
```

2. **Backend**:
   - Follow the [Backend - Spring Boot](#backend---spring-boot) section for setup instructions.
   
3. **Frontend**:
   - Follow the [Frontend - React](#frontend---react) section for setup instructions.

4. Make sure both the frontend and backend are running. The frontend should be accessible at `http://localhost:3000`, and the backend should be available at `http://localhost:8080`.

## Future Features

- **Movie/TV Show Recommendations**: Integrate an API to recommend movies based on user preferences.
- **Role-based Access Control**: Introduce roles (Admin, User) with specific permissions (e.g., Admin can manage users).

