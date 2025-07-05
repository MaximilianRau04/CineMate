
# CineMate - Movie & Series Management Platform

CineMate is a comprehensive web application that allows users to discover, manage, and track their favorite movies and TV series. The platform features personalized recommendations, social features, notification system, and admin management tools. Built with **React** frontend and **Spring Boot** backend using **MongoDB** for data storage.

## 🌟 Key Features

### 📱 **User Features**
- **Content Discovery**: Browse and search through extensive movie and series catalog
- **Personal Management**: Favorites, watchlist, and watched history tracking
- **Rating & Reviews**: Rate content and write detailed reviews
- **Personalized Recommendations**: AI-powered content suggestions based on preferences
- **Smart Notifications**: Get notified about new releases, recommendations, and updates
- **Profile Customization**: Personal bio, profile picture, and preferences management
- **Release Calendar**: Track upcoming releases of anticipated content

### 🔧 **Admin Features**
- **Content Management**: Add, edit, and manage movies and series
- **User Administration**: Manage user accounts and permissions
- **Analytics Dashboard**: Monitor system usage and content performance
- **Notification Management**: Send announcements and system notifications

### 🤖 **Intelligent Systems**
- **Recommendation Engine**: Content-based filtering using genres, actors, and directors
- **Notification System**: Real-time web and email notifications
- **Auto-Triggered Recommendations**: Smart suggestions based on user activity

## 🛠️ Technologies

- **Frontend**: React, Axios, React Router, CSS3
- **Backend**: Spring Boot, Spring Security, Spring Data MongoDB
- **Database**: MongoDB (NoSQL)
- **Authentication**: JSON Web Token (JWT)
- **Email Service**: Spring Mail with HTML templates
- **Scheduling**: Spring Task Scheduling
- **Real-time**: WebSocket for live notifications

## Table of Contents
1. [Installation](#installation)
2. [Backend Setup](#backend---spring-boot)
3. [Frontend Setup](#frontend---react)
4. [API Documentation](#api-endpoints)
5. [Features Overview](#features-overview)
6. [System Architecture](#system-architecture)
7. [Contributing](#contributing)

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

## Installation

### Prerequisites
- **Java 11** or higher
- **Maven 3.6+**
- **Node.js 16+** and **npm**
- **MongoDB** (local installation or cloud service like MongoDB Atlas)

### Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/cinemate.git
cd cinemate
```

2. **Setup MongoDB:**
   - Local: Install MongoDB and start the service
   - Cloud: Create a MongoDB Atlas cluster and get connection string

3. **Backend Setup:**
```bash
cd backend
# Configure application.properties with your MongoDB connection
mvn spring-boot:run
```

4. **Frontend Setup:**
```bash
cd frontend
npm install
npm start
```

5. **Access the application:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8080`

## Backend - Spring Boot

### Configuration

Configure your `application.properties`:

```properties
# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/cinemate
# or for MongoDB Atlas:
# spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/cinemate

# JWT Configuration
cinemate.jwt.secret=yourSecretKey
cinemate.jwt.expiration=86400000

# Email Configuration (optional)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# File Upload Configuration
cinemate.upload.dir=./uploads
spring.servlet.multipart.max-file-size=10MB
```

### Build and Run

```bash
# Development
mvn spring-boot:run

# Production Build
mvn clean package
java -jar target/cinemate-backend.jar
```

## Frontend - React

### Setup

```bash
cd frontend
npm install
```

### Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

### Development

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Features Overview

#### 🔐 **Authentication & User Management**
- **Secure Registration/Login**: JWT-based authentication
- **Profile Management**: Customizable profiles with bio and profile pictures
- **Password Security**: Encrypted password storage
- **Session Management**: Automatic token refresh and logout

#### 🎬 **Content Management**
- **Extensive Catalog**: Movies and TV series with detailed metadata
- **Advanced Search**: Filter by genre, year, rating, actors, directors
- **Rich Media**: Posters, trailers, and detailed descriptions
- **Content Organization**: Structured by genres, actors, directors

#### 📝 **Personal Lists & Tracking**
- **Favorites**: Save preferred movies and series
- **Watchlist**: Track content to watch later
- **Watched History**: Keep record of viewed content
- **Custom Lists**: Organize content by personal categories

#### ⭐ **Reviews & Ratings**
- **Star Ratings**: 0.5 to 5.0 star rating system
- **Detailed Reviews**: Write and read comprehensive reviews
- **Community Feedback**: See what others think about content
- **Review Management**: Edit and delete your own reviews

#### 🤖 **Smart Recommendations**
- **Personalized Suggestions**: Based on viewing history and preferences
- **Content-Based Filtering**: Recommendations using genres, actors, directors
- **Real-time Updates**: New suggestions based on latest activity
- **Recommendation Explanations**: Understand why content was suggested

#### 🔔 **Notification System**
- **Real-time Notifications**: Instant web notifications
- **Email Notifications**: Beautiful HTML email templates
- **Smart Triggers**: Notifications based on new releases, recommendations
- **Customizable Preferences**: Control what notifications you receive
- **Notification Types**:
  - New movie/series releases
  - Watchlist item releases
  - New recommendations
  - Review responses
  - System announcements

#### 📅 **Release Calendar**
- **Upcoming Releases**: Track future movie and series releases
- **Personal Calendar**: See releases for your watchlist items
- **Release Notifications**: Get notified when anticipated content releases
- **Monthly/Weekly Views**: Organized calendar interface

#### 👨‍💼 **Admin Features**
- **Content Management**: Add, edit, delete movies and series
- **User Administration**: Manage user accounts and permissions
- **Dashboard Analytics**: System usage and content statistics
- **Notification Broadcasting**: Send announcements to users
- **Content Moderation**: Review and approve user-generated content

## API Endpoints

### 🔐 Authentication
```
POST /api/auth/register          # Register new user
POST /api/auth/login             # Login user
POST /api/auth/refresh           # Refresh JWT token
POST /api/auth/logout            # Logout user
```

### 👤 User Management
```
GET    /api/users/me                    # Get current user profile
PUT    /api/users/me                    # Update current user profile
POST   /api/users/upload-profile-image  # Upload profile picture
GET    /api/users/{id}                  # Get user by ID
PUT    /api/users/{id}                  # Update user (admin only)
DELETE /api/users/{id}                  # Delete user (admin only)
```

### 🎬 Movies
```
GET    /api/movies                 # Get all movies (with pagination)
GET    /api/movies/{id}           # Get movie by ID
POST   /api/movies               # Create movie (admin only)
PUT    /api/movies/{id}          # Update movie (admin only)
DELETE /api/movies/{id}          # Delete movie (admin only)
GET    /api/movies/search        # Search movies
GET    /api/movies/genre/{genre} # Get movies by genre
```

### 📺 Series
```
GET    /api/series                 # Get all series (with pagination)
GET    /api/series/{id}           # Get series by ID
POST   /api/series               # Create series (admin only)
PUT    /api/series/{id}          # Update series (admin only)
DELETE /api/series/{id}          # Delete series (admin only)
GET    /api/series/search        # Search series
```

### ⭐ Reviews
```
GET    /api/reviews                    # Get all reviews
GET    /api/reviews/{id}              # Get review by ID
POST   /api/reviews                   # Create review
PUT    /api/reviews/{id}              # Update review
DELETE /api/reviews/{id}              # Delete review
GET    /api/reviews/movie/{movieId}   # Get reviews for movie
GET    /api/reviews/series/{seriesId} # Get reviews for series
GET    /api/reviews/user/{userId}     # Get user's reviews
```

### 📋 Personal Lists
```
# Favorites
GET    /api/users/{userId}/favorites/movies    # Get favorite movies
POST   /api/users/{userId}/favorites/movies/{movieId}    # Add movie to favorites
DELETE /api/users/{userId}/favorites/movies/{movieId}    # Remove movie from favorites
GET    /api/users/{userId}/favorites/series    # Get favorite series
POST   /api/users/{userId}/favorites/series/{seriesId}  # Add series to favorites
DELETE /api/users/{userId}/favorites/series/{seriesId}  # Remove series from favorites

# Watchlist
GET    /api/users/{userId}/watchlist/movies     # Get movie watchlist
POST   /api/users/{userId}/watchlist/movies/{movieId}   # Add movie to watchlist
DELETE /api/users/{userId}/watchlist/movies/{movieId}   # Remove movie from watchlist
GET    /api/users/{userId}/watchlist/series     # Get series watchlist
POST   /api/users/{userId}/watchlist/series/{seriesId} # Add series to watchlist
DELETE /api/users/{userId}/watchlist/series/{seriesId} # Remove series from watchlist

# Watched
GET    /api/users/{userId}/watched/movies       # Get watched movies
POST   /api/users/{userId}/watched/movies/{movieId}     # Mark movie as watched
DELETE /api/users/{userId}/watched/movies/{movieId}     # Remove movie from watched
GET    /api/users/{userId}/watched/series       # Get watched series
POST   /api/users/{userId}/watched/series/{seriesId}   # Mark series as watched
DELETE /api/users/{userId}/watched/series/{seriesId}   # Remove series from watched
```

### 🤖 Recommendations
```
GET    /api/recommendations/{userId}           # Get personalized recommendations
POST   /api/recommendations/notify/{userId}   # Send recommendation notifications
POST   /api/recommendations/notify/all        # Send recommendations to all users
```

### 🔔 Notifications
```
GET    /api/notifications                     # Get user notifications
GET    /api/notifications/unread             # Get unread notifications
PUT    /api/notifications/{id}/read          # Mark notification as read
PUT    /api/notifications/mark-all-read      # Mark all notifications as read
DELETE /api/notifications/{id}               # Delete notification

# Notification Preferences
GET    /api/notifications/preferences        # Get notification preferences
PUT    /api/notifications/preferences        # Update notification preferences
```

### 🎭 Actors & Directors
```
GET    /api/actors                 # Get all actors
GET    /api/actors/{id}           # Get actor by ID
POST   /api/actors               # Create actor (admin only)
PUT    /api/actors/{id}          # Update actor (admin only)
DELETE /api/actors/{id}          # Delete actor (admin only)

GET    /api/directors             # Get all directors
GET    /api/directors/{id}       # Get director by ID
POST   /api/directors            # Create director (admin only)
PUT    /api/directors/{id}       # Update director (admin only)
DELETE /api/directors/{id}       # Delete director (admin only)
```

### 👨‍💼 Admin Endpoints
```
GET    /api/admin/dashboard              # Get admin dashboard data
POST   /api/admin/notifications         # Send admin notifications
GET    /api/admin/users                 # Get all users (admin only)
PUT    /api/admin/users/{id}/role       # Update user role (admin only)
GET    /api/admin/content/pending       # Get pending content reviews
```

## System Architecture

### 🏗️ **Backend Architecture**
- **Layered Architecture**: Controller → Service → Repository
- **Security**: JWT authentication with role-based access control
- **Event-Driven**: Spring Events for decoupled notification system
- **Scheduled Tasks**: Automated recommendation and notification sending
- **File Upload**: Profile pictures and content media management

### 🎨 **Frontend Architecture**
- **Component-Based**: Reusable React components
- **Routing**: React Router for navigation
- **State Management**: React Context and hooks
- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: WebSocket integration for live notifications

### 📊 **Database Schema**
- **Users**: Authentication, preferences, and profile data
- **Movies/Series**: Content metadata and relationships
- **Reviews**: User ratings and review content
- **Notifications**: System and user notifications
- **Actors/Directors**: Content creator information

## 🔧 Configuration Options

### Recommendation System
- **Algorithm**: Content-based filtering
- **Trigger Events**: Favorites, ratings, watchlist updates
- **Frequency**: Weekly scheduled + event-driven
- **Customization**: User preference-based filtering

### Notification System
- **Delivery Methods**: Web notifications + Email
- **Rate Limiting**: Configurable email limits per user
- **Templates**: HTML email templates
- **Preferences**: Granular user control

### Security Features
- **Password Hashing**: BCrypt encryption
- **JWT Security**: Configurable expiration and refresh
- **Role-Based Access**: Admin and User roles
- **Input Validation**: Comprehensive request validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue on GitHub or contact the developer.

