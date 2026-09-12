# CineMate

CineMate is a web application for discovering, managing, and tracking movies and TV series. It combines personal watchlists, ratings and reviews, personalized recommendations, and social features (friends, forum, leaderboard) with an admin backend for content and community management.

Built with a React frontend and a Spring Boot backend, using MongoDB for storage.

## Tech Stack

- **Frontend**: React, React Router, Axios, Bootstrap
- **Backend**: Spring Boot, Spring Security (JWT), Spring Data MongoDB, Spring Mail, WebSocket
- **Database**: MongoDB
- **API Docs**: springdoc-openapi (Swagger UI)

## Features

- **Content**: browsable movie/series catalog with search, filters, and detailed metadata (cast, crew, seasons, streaming availability)
- **Personal lists**: favorites, watchlist, watched history, ratings and reviews
- **Recommendations**: content-based, collaborative, and hybrid recommendation engine, delivered via notifications and digest emails
- **Notifications**: real-time web notifications and HTML emails for releases, recommendations, milestones, and social activity
- **Social**: friends, activity points, leaderboard, and a full discussion forum (posts, replies, likes, subscriptions)
- **Release calendar**: track upcoming releases for watchlist items
- **Admin**: content management, user administration, forum moderation, streaming provider management, and usage analytics

## Getting Started

### Prerequisites

- Java 21+
- Maven 3.6+ (or use the included `./mvnw`)
- Node.js 18+ and npm
- Docker (for MongoDB via `docker-compose`), or a local/Atlas MongoDB instance

### 1. Clone the repository

```bash
git clone https://github.com/MaximilianRau04/CineMate.git
cd CineMate
```

### 2. Configure environment variables

Create a `.env` file in the project root:

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

> Use development-only credentials here, not production secrets.

### 3. Start MongoDB (and Mongo Express)

```bash
docker compose up -d --build
```

### 4. Run the backend

Create `backend/src/main/resources/application.properties`:

```properties
server.port=8080

spring.data.mongodb.uri=mongodb://localhost:27017/cinemate
spring.data.mongodb.username=yourusername
spring.data.mongodb.password=yourpassword

# use `openssl rand -base64 32` to generate a secret
jwt.secret=yourjwtsecretkey

# optional, needed for email notifications
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password

upload.dir=./uploads
```

```bash
cd backend
./mvnw spring-boot:run
```

The API runs at `http://localhost:8080`, Mongo Express at `http://localhost:8081`.

### 5. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Other frontend scripts: `npm run build` (production build), `npm run preview` (preview the build), `npm run format` (Prettier).

## API Documentation

Interactive Swagger UI: `http://localhost:8080/swagger-ui/index.html`
Raw OpenAPI JSON: `http://localhost:8080/v3/api-docs`

If Swagger UI fails with "The provided definition does not specify a valid version field", confirm the backend is running and that `/v3/api-docs` returns a JSON object starting with `{"openapi": "..."}`. The OpenAPI bean is configured in `backend/src/main/java/com/cinemate/config/OpenApiConfig.java`.

## Project Structure

- `backend/` — Spring Boot REST API (layered controller → service → repository, package-per-domain)
- `frontend/` — React SPA
- `docker-compose.yml` — MongoDB + Mongo Express for local development

See [`DIRECTORY.md`](DIRECTORY.md) for the full generated file tree.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push the branch: `git push origin feature/your-feature`
5. Open a pull request

## License

This project is licensed under the [MIT License](LICENSE).

## Support

For questions or issues, please open an issue on GitHub.
