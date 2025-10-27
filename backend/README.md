# 🎯 Spring Boot RESTful API – Movies & Series

This is a Java backend application that provides a REST API for managing movies and TV series.  
It uses Spring Boot and connects to a MongoDB database.

📍 **Base URL**: [http://localhost:8080/api](http://localhost:8080/api)  
📘 **Swagger UI**: [http://localhost:8080/api/swagger-ui](http://localhost:8080/api/swagger-ui.html)  
📄 **OpenAPI JSON**: [http://localhost:8080/api/api-docs](http://localhost:8080/api/api-docs)


## Prerequisites

- Java 21+
- `JAVA_HOME` environment variable set
- (Optional) [Maven](https://maven.apache.org/) installed – or use Maven Wrapper (`./mvnw`)
- Running [MongoDB](https://www.mongodb.com) server  

Configure DB credentials and port in [`application.properties`](src/main/resources/application.properties) if needed.  
Default: `root:root` on port `27017`.

### 📦 Build & Run

```bash
# build and package executable --> appears in target/rest-api.jar
./mvnw clean install

# execute tests only
./mvnw test

# generate test coverage report (execute tests first) --> appears in target/site/jacoco/index.html
./mvnw jacoco:report

# build and package executable without running tests
./mvnw clean install -DskipTests

# run the created JAR file
java -jar ./target/rest-api.jar

# for development: build and run in live-reload mode (rebuild on save)
./mvnw spring-boot:run
```

After you run the created JAR file, you should be able to see the implemented resources in your browser
