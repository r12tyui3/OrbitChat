# Build stage
FROM gradle:8.9-jdk21-alpine AS build
WORKDIR /app
COPY . .
RUN gradle bootJar

# Package stage
FROM openjdk:21-jdk-slim
ENV JAVA_TOOL_OPTIONS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
