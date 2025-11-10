# CineMate - Movie & Series Management Platform

CineMate is a comprehensive web application that allows users to discover, manage, and track their favorite movies and TV series. The platform features personalized recommendations, social features, notification system, and admin management tools. Built with **React** frontend and **Spring Boot** backend using **MongoDB** for data storage.

## 🌟 Key Features

### 📱 **User Features**
- **Content Discovery**: Browse and search through extensive movie and series catalog
- **Personal Management**: Favorites, watchlist, and watched history tracking
- **Rating & Reviews**: Rate content and write detailed reviews
- **Personalized Recommendations**: Multiple recommendation algorithms (content-based, collaborative, hybrid)
- **Smart Notifications**: Get notified about new releases, recommendations, and updates
- **Profile Customization**: Personal bio, profile picture, and preferences management
- **Release Calendar**: Track upcoming releases of anticipated content
- **Streaming Availability**: Check where movies and series are available to stream

### 🤝 **Social Features**
- **Friend System**: Connect with other users and see their activity
- **Friend Requests**: Send, accept, and manage friend requests
- **Activity Points**: Earn points for various activities and engagement
- **Leaderboard**: Compete with friends based on activity and ratings
- **Forum System**: Discuss movies and series with community members
- **Post & Reply**: Create discussion threads and engage with others
- **Subscription System**: Follow interesting discussions and get notified of new replies
- **Like System**: Like posts and replies to show appreciation
- **Forum Categories**: Organize discussions by categories
- **Advanced Forum Search**: Find specific posts and discussions

### 🔧 **Admin Features**
- **Content Management**: Add, edit, and manage movies and series
- **User Administration**: Manage user accounts and permissions
- **Analytics Dashboard**: Monitor system usage and content performance
- **Notification Management**: Send announcements and system notifications
- **Forum Moderation**: Pin, lock, and manage forum discussions
- **Streaming Management**: Manage streaming providers and availability
- **Actor/Director Management**: Manage cast and crew information

### 🤖 **Intelligent Systems**
- **Multi-Algorithm Recommendations**: Content-based, collaborative, and hybrid filtering
- **Smart Recommendation Engine**: Personalized suggestions based on user behavior
- **Notification System**: Real-time web and email notifications
- **Auto-Triggered Recommendations**: Smart suggestions based on user activity
- **Milestone Notifications**: Celebrate user achievements and milestones
- **Upcoming Release Notifications**: Alert users about content they're waiting for

## 🛠️ Technologies

- **Frontend**: React, Axios, React Router, CSS3
- **Backend**: Spring Boot, Spring Security, Spring Data MongoDB, Spring Mail
- **Database**: MongoDB (NoSQL)
- **Authentication**: JSON Web Token (JWT)
- **Email Service**: Spring Mail with HTML templates
- **Scheduling**: Spring Task Scheduling for automated notifications
- **Real-time**: WebSocket for live notifications
- **File Upload**: Multipart file handling for profile images
- **Social Features**: Friend system, forum, and activity tracking
- **Streaming Integration**: Multi-platform content availability tracking

## Table of Contents
1. [Installation](#installation)
2. [Backend Setup](#backend---spring-boot)
3. [Frontend Setup](#frontend---react)
4. [API Documentation](#api-endpoints)
5. [Features Overview](#features-overview)
6. [System Architecture](#system-architecture)
7. [Contributing](#contributing)

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

## Create a .env file
```bash
# MongoDB
MONGO_DB=cinemate
MONGO_PORT=27017
MONGO_USER=yourusername
MONGO_PASSWORD=yourpassword

# Mongo Express
MONGO_EXPRESS_PORT=8081

# Backend
BACKEND_PORT=8080
```
> Replace the values with your own settings. Do not use sensitive production credentials during development.

### Start Database and MongoExpress via Docker
```bash
docker compose up -d --build
```

## Backend - Spring Boot

### Configuration

Create and configure your `application.properties`:

```properties
server.port=8080

# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/cinemate
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.database=cinemate
spring.data.mongodb.username=yourusername
spring.data.mongodb.password=yourpassword

# JWT Configuration, for example use openssl rand -base64 32
jwt.secret=yourjwtsecretkey

# Email Configuration (optional)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# File Upload Configuration
upload.dir=./uploads
spring.servlet.multipart.max-file-size=10MB

# Swagger
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.configUrl=/v3/api-docs/swagger-config
springdoc.swagger-ui.url=/v3/api-docs
springdoc.swagger-ui.operationsSorter=alpha
springdoc.swagger-ui.tagsSorter=alpha

```

### Build and Run

```bash
# Development
mvn spring-boot:run

# Production Build
mvn clean package
java -jar target/cinemate-backend.jar
```

### Access the application
- Backend API: http://localhost:8080
- Mongo Express: http://localhost:8081

## API Endpoints

The backend exposes an OpenAPI (Swagger) documentation UI you can use to explore all available endpoints and their request/response schemas.

- Swagger UI (interactive): http://localhost:8080/swagger-ui/index.html
- Raw OpenAPI JSON: http://localhost:8080/v3/api-docs

How to use

1. Start the backend

2. Open the Swagger UI URL in your browser. The UI shows grouped endpoints, models, and allows you to try requests directly from the browser.

3. If you prefer to fetch the raw OpenAPI document (JSON):

```bash
curl -i http://localhost:8080/v3/api-docs
```

Common issues

- If the Swagger UI fails with "The provided definition does not specify a valid version field", check that the backend is running and that `/v3/api-docs` returns a JSON object starting with `{"openapi": "..."}` and not a quoted string (this can happen if a custom HTTP message converter serializes the api-docs bytes incorrectly).
- If you changed the OpenAPI configuration, the custom bean lives at `backend/src/main/java/com/cinemate/config/OpenApiConfig.java`.


## Frontend - React

### Setup

```bash
cd frontend
npm install
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

## Features Overview

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
- **Multi-Algorithm System**: Content-based, collaborative, and hybrid filtering
- **Personalized Suggestions**: Based on viewing history and preferences
- **Trending Content**: Discover what's popular right now
- **Genre-Based Recommendations**: Targeted suggestions by genre
- **Smart Notifications**: Automatic recommendation delivery
- **Triggered Recommendations**: Context-aware suggestions based on user actions
- **Recommendation Summaries**: Weekly and daily digest emails

#### 🔔 **Notification System**
- **Real-time Notifications**: Instant web notifications
- **Email Notifications**: Beautiful HTML email templates
- **Smart Triggers**: Notifications based on new releases, recommendations, milestones
- **Customizable Preferences**: Granular control over notification types
- **Auto-Notifications**: Scheduled daily and weekly notifications
- **Milestone Celebrations**: Achievement and progress notifications
- **Notification Types**:
  - New movie/series releases
  - Watchlist item releases
  - New recommendations
  - Review responses
  - Friend requests and activities
  - Forum replies and mentions
  - System announcements
  - User milestones

#### 📅 **Release Calendar**
- **Upcoming Releases**: Track future movie and series releases
- **Personal Calendar**: See releases for your watchlist items
- **Release Notifications**: Get notified when anticipated content releases
- **Monthly/Weekly Views**: Organized calendar interface

#### 🤝 **Social Features**
- **Friend System**: Send, accept, and manage friend requests
- **Friend Activity**: See what your friends are watching and rating
- **Activity Points**: Earn points for reviews, ratings, and engagement
- **Leaderboard**: Compete with friends based on activity and points
- **Friend Profiles**: View detailed profiles of your friends
- **Social Notifications**: Get notified about friend activities
- **Forum System**: Full-featured discussion forum with categories
- **Forum Posts**: Create and participate in movie/series discussions
- **Forum Replies**: Engage in threaded conversations
- **Like System**: Like posts and replies to show appreciation
- **Forum Subscriptions**: Follow interesting discussions
- **Forum Search**: Find specific posts and discussions
- **Forum Statistics**: Track engagement and activity
- **Forum Moderation**: Admin tools for community management

#### 📺 **Streaming Integration**
- **Multi-Platform Support**: Track content across various streaming services
- **Regional Availability**: Check where content is available in your region
- **Streaming Provider Management**: Admin tools for managing platform data
- **Availability Tracking**: Real-time updates on content availability
- **Cross-Platform Search**: Find content across all supported platforms

#### 🎭 **Content & Cast Management**
- **Detailed Cast Information**: Comprehensive actor and director profiles
- **Filmography Tracking**: Complete works of actors and directors
- **Content Relationships**: Link movies and series to their cast and crew
- **Season Management**: Detailed series and season information
- **Rich Metadata**: Extensive information about all content

#### 👨‍💼 **Admin Features**
- **Content Management**: Add, edit, and manage movies and series
- **User Administration**: Manage user accounts and permissions
- **Dashboard Analytics**: System usage and content statistics
- **Notification Broadcasting**: Send announcements to users
- **Content Moderation**: Review and approve user-generated content
- **Streaming Management**: Manage providers and availability data
- **Forum Moderation**: Advanced tools for community management

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
- **Users**: Authentication, preferences, profile data, and social connections
- **Movies/Series**: Content metadata, cast, crew, and streaming availability
- **Reviews**: User ratings and review content with detailed metadata
- **Notifications**: System and user notifications with preferences
- **Actors/Directors**: Content creator information and filmography
- **Social Features**: Friend relationships, activity points, and forum data
- **Forum Posts/Replies**: Discussion threads with likes and subscriptions
- **Streaming Providers**: Platform information and content availability
- **Recommendation Data**: User preferences and recommendation history

## 🔧 Configuration Options

### Recommendation System
- **Multiple Algorithms**: Content-based, collaborative, and hybrid filtering
- **Trigger Events**: Favorites, ratings, watchlist updates, and social interactions
- **Frequency**: Daily, weekly scheduled + real-time event-driven
- **Customization**: User preference-based filtering and trending content
- **Smart Summaries**: Automated recommendation digest emails

### Notification System
- **Delivery Methods**: Web notifications + Email with HTML templates
- **Rate Limiting**: Configurable email limits per user
- **Scheduling**: Daily and weekly automated notifications
- **Preferences**: Granular user control over notification types
- **Auto-Triggers**: Milestone celebrations and release notifications

### Social Features
- **Friend System**: Request-based friendship with activity tracking
- **Activity Points**: Configurable point system for user engagement
- **Forum System**: Category-based discussions with moderation tools
- **Leaderboard**: Competition tracking with various metrics

### Security Features
- **Password Hashing**: BCrypt encryption
- **JWT Security**: Configurable expiration and refresh tokens
- **Role-Based Access**: Admin and User roles with granular permissions
- **Input Validation**: Comprehensive request validation
- **File Upload Security**: Secure multipart file handling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

For support and questions, please open an issue on GitHub or contact the developer.
