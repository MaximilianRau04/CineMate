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

## API Endpoints

### 🔐 Authentication
```
POST /api/auth/register          # Register new user
POST /api/auth/login             # Login user
```

### 👤 User Management
```
GET    /api/users                       # Get all users
GET    /api/users/{id}                  # Get user by ID
GET    /api/users/me                    # Get current user profile
POST   /api/users                       # Create user
PUT    /api/users/{id}                  # Update user profile (with multipart support)
DELETE /api/users/{id}                  # Delete user
```

### 🎬 Movies
```
GET    /api/movies                     # Get all movies (with pagination)
GET    /api/movies/{id}               # Get movie by ID
POST   /api/movies                    # Create movie (admin only)
PUT    /api/movies/{id}               # Update movie (admin only)
DELETE /api/movies/{id}               # Delete movie (admin only)
GET    /api/movies/search             # Search movies
GET    /api/movies/genre/{genre}      # Get movies by genre
GET    /api/movies/{id}/actors        # Get actors of a movie
GET    /api/movies/{id}/directors     # Get directors of a movie
POST   /api/movies/{movieId}/actors/{actorId}     # Add actor to movie
DELETE /api/movies/{movieId}/actors/{actorId}     # Remove actor from movie
POST   /api/movies/{movieId}/directors/{directorId}   # Add director to movie
DELETE /api/movies/{movieId}/directors/{directorId}   # Remove director from movie
```

### 📺 Series
```
GET    /api/series                     # Get all series (with pagination)
GET    /api/series/{id}               # Get series by ID
POST   /api/series                    # Create series (admin only)
PUT    /api/series/{id}               # Update series (admin only)
DELETE /api/series/{id}               # Delete series (admin only)
GET    /api/series/search             # Search series
GET    /api/series/{id}/seasons       # Get seasons of a series
GET    /api/series/{id}/seasons/{seasonNumber} # Get specific season
POST   /api/series/{id}/seasons       # Add season to series (admin only)
```

### ⭐ Reviews
```
GET    /api/reviews                    # Get all reviews
GET    /api/reviews/{id}              # Get review by ID
POST   /api/reviews/movie/{movieId}/user/{userId}     # Create movie review
POST   /api/reviews/series/{seriesId}/user/{userId}   # Create series review
PUT    /api/reviews/{id}              # Update review
DELETE /api/reviews/{id}              # Delete review
GET    /api/reviews/movie/{movieId}   # Get reviews for movie
GET    /api/reviews/series/{seriesId} # Get reviews for series
GET    /api/reviews/user/{userId}     # Get user's reviews
GET    /api/reviews/movie/{movieId}/user/{userId}  # Get specific user's movie review
GET    /api/reviews/series/{seriesId}/user/{userId} # Get specific user's series review
GET    /api/reviews/{id}/user         # Get review author
GET    /api/reviews/{id}/movie        # Get movie for review
GET    /api/reviews/{id}/series       # Get series for review
GET    /api/reviews/{id}/media        # Get media info for review
```

### 📋 Personal Lists
```
# Favorites
GET    /api/users/{userId}/favorites/movies    # Get favorite movies
PUT    /api/users/{userId}/favorites/movies/{movieId}    # Add movie to favorites
DELETE /api/users/{userId}/favorites/movies/{movieId}    # Remove movie from favorites
GET    /api/users/{userId}/favorites/series    # Get favorite series
PUT    /api/users/{userId}/favorites/series/{seriesId}  # Add series to favorites
DELETE /api/users/{userId}/favorites/series/{seriesId}  # Remove series from favorites

# Watchlist
GET    /api/users/{userId}/watchlist/movies     # Get movie watchlist
PUT    /api/users/{userId}/watchlist/movies/{movieId}   # Add movie to watchlist
DELETE /api/users/{userId}/watchlist/movies/{movieId}   # Remove movie from watchlist
GET    /api/users/{userId}/watchlist/series     # Get series watchlist
PUT    /api/users/{userId}/watchlist/series/{seriesId} # Add series to watchlist
DELETE /api/users/{userId}/watchlist/series/{seriesId} # Remove series from watchlist

# Watched
GET    /api/users/{userId}/watched/movies       # Get watched movies
PUT    /api/users/{userId}/watched/movies/{movieId}     # Mark movie as watched
DELETE /api/users/{userId}/watched/movies/{movieId}     # Remove movie from watched
GET    /api/users/{userId}/watched/series       # Get watched series
PUT    /api/users/{userId}/watched/series/{seriesId}   # Mark series as watched
DELETE /api/users/{userId}/watched/series/{seriesId}   # Remove series from watched
```

### 🤖 Recommendations
```
GET    /api/recommendations/user/{userId}           # Get personalized recommendations
GET    /api/recommendations/trending                # Get trending content
GET    /api/recommendations/genre/{genre}           # Get recommendations by genre
GET    /api/recommendations/user/{userId}/hybrid    # Get hybrid recommendations
GET    /api/recommendations/user/{userId}/smart     # Get smart recommendations
GET    /api/recommendations/user/{userId}/collaborative # Get collaborative filtering recommendations
POST   /api/recommendations/notify/{userId}         # Send recommendation notifications
POST   /api/recommendations/notify/{userId}/summary # Send recommendation summary
POST   /api/recommendations/notify/all              # Send recommendations to all users
POST   /api/recommendations/notify/all/summary      # Send summary to all users
POST   /api/recommendations/notify/{userId}/triggered # Send triggered recommendations
```

### 🔔 Notifications
```
GET    /api/notifications/user/{userId}           # Get user notifications
GET    /api/notifications/user/{userId}/unread    # Get unread notifications
GET    /api/notifications/user/{userId}/unread/count # Get unread notification count
POST   /api/notifications                         # Create notification
PUT    /api/notifications/{id}/read               # Mark notification as read
PUT    /api/notifications/user/{userId}/read-all  # Mark all notifications as read
DELETE /api/notifications/{id}                    # Delete notification

# Notification Preferences
GET    /api/notification-preferences/user/{userId}        # Get notification preferences
PUT    /api/notification-preferences/user/{userId}        # Update notification preferences
PUT    /api/notification-preferences/user/{userId}/global # Update global notification settings
GET    /api/notification-preferences/user/{userId}/global # Get global notification settings
GET    /api/notification-preferences/types               # Get available notification types

# Auto Notifications
POST   /api/notifications/check-milestones/{userId}   # Check user milestones
POST   /api/notifications/upcoming-releases/{userId}  # Check upcoming releases
POST   /api/notifications/trigger-weekly              # Trigger weekly notifications
POST   /api/notifications/trigger-daily               # Trigger daily notifications
```

### 🎭 Actors & Directors
```
GET    /api/actors                     # Get all actors
GET    /api/actors/{id}               # Get actor by ID
POST   /api/actors                    # Create actor (admin only)
PUT    /api/actors/{id}               # Update actor (admin only)
DELETE /api/actors/{id}               # Delete actor (admin only)
GET    /api/actors/{actorId}/movies   # Get movies by actor
GET    /api/actors/{actorId}/series   # Get series by actor

GET    /api/directors                 # Get all directors
GET    /api/directors/{id}           # Get director by ID
POST   /api/directors                # Create director (admin only)
PUT    /api/directors/{id}           # Update director (admin only)
DELETE /api/directors/{id}           # Delete director (admin only)
GET    /api/directors/{id}/movies    # Get movies by director
GET    /api/directors/{id}/series    # Get series by director
```

### 🤝 Social Features
```
# Friends
POST   /api/social/friends/request/{targetUserId}  # Send friend request
POST   /api/social/friends/accept/{friendshipId}   # Accept friend request
POST   /api/social/friends/decline/{friendshipId}  # Decline friend request
GET    /api/social/friends                        # Get current user's friends
GET    /api/social/friends/{userId}               # Get user's friends
GET    /api/social/friends/requests               # Get friend requests
DELETE /api/social/friends/{friendUserId}         # Remove friend

# Points & Leaderboard
GET    /api/social/points                         # Get current user's points
GET    /api/social/points/{userId}                # Get user's points
GET    /api/social/leaderboard                    # Get leaderboard
```

### 📺 Streaming Services
```
# Streaming Providers
GET    /api/streaming/providers                   # Get available streaming providers
GET    /api/streaming/providers/all               # Get all streaming providers
GET    /api/streaming/providers/country/{country} # Get providers by country
GET    /api/streaming/providers/{id}              # Get provider by ID
POST   /api/streaming/providers                   # Create streaming provider (admin only)
PUT    /api/streaming/providers/{id}              # Update streaming provider (admin only)
DELETE /api/streaming/providers/{id}              # Delete streaming provider (admin only)
DELETE /api/streaming/providers/cleanup-orphaned  # Cleanup orphaned providers

# Streaming Availability
GET    /api/streaming/availability/{mediaType}/{mediaId}         # Get availability for media
GET    /api/streaming/availability/{mediaType}/{mediaId}/region/{region} # Get regional availability
POST   /api/streaming/availability/{mediaType}/{mediaId}         # Add streaming availability
PUT    /api/streaming/availability/{availabilityId}              # Update availability
DELETE /api/streaming/availability/{availabilityId}              # Delete availability
DELETE /api/streaming/availability/{mediaType}/{mediaId}         # Delete all availability for media
```

### 💬 Forum System
```
# Forum Posts
POST   /api/forum/posts                           # Create forum post
GET    /api/forum/posts                           # Get all forum posts
GET    /api/forum/posts/{id}                      # Get forum post by ID
GET    /api/forum/posts/pinned                    # Get pinned posts
GET    /api/forum/posts/search                    # Search forum posts
GET    /api/forum/posts/user/{userId}             # Get posts by user
GET    /api/forum/posts/movie/{movieId}           # Get posts about movie
GET    /api/forum/posts/series/{seriesId}         # Get posts about series
GET    /api/forum/posts/user/{userId}/participated # Get posts user participated in
PUT    /api/forum/posts/{id}                      # Update forum post
DELETE /api/forum/posts/{id}                      # Delete forum post
POST   /api/forum/posts/{id}/like                 # Like/unlike forum post

# Forum Replies
POST   /api/forum/posts/{postId}/replies          # Create reply to post
GET    /api/forum/posts/{postId}/replies          # Get replies for post
GET    /api/forum/replies/user/{userId}           # Get replies by user
PUT    /api/forum/replies/{id}                    # Update reply
DELETE /api/forum/replies/{id}                    # Delete reply
POST   /api/forum/replies/{id}/like               # Like/unlike reply

# Forum Subscriptions
POST   /api/forum/posts/{postId}/subscribe        # Subscribe to post
DELETE /api/forum/posts/{postId}/unsubscribe      # Unsubscribe from post
GET    /api/forum/posts/{postId}/subscription-status # Get subscription status
GET    /api/forum/subscriptions                   # Get user's subscriptions

# Forum Stats & Categories
GET    /api/forum/stats/category/{category}       # Get category statistics
GET    /api/forum/stats/user/{userId}             # Get user forum statistics
GET    /api/forum/categories                      # Get available categories

# Forum Admin
POST   /api/forum/admin/posts/{id}/pin            # Pin/unpin post (admin only)
POST   /api/forum/admin/posts/{id}/lock           # Lock/unlock post (admin only)
```

### 👨‍💼 Admin Endpoints
```
GET    /api/admin/dashboard              # Get admin dashboard data
POST   /api/admin/notifications/send     # Send admin notifications
GET    /api/admin/notifications/users    # Get all users for notifications
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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue on GitHub or contact the developer.
