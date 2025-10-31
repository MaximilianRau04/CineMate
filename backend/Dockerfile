# --- Build stage: compile the Spring Boot app ---
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy Maven config and source code
COPY pom.xml .
COPY src ./src

# Build application (skip tests for speed)
RUN mvn clean package -DskipTests

# --- Runtime stage: minimal JRE image ---
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose backend port
EXPOSE 8080

# Start the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
