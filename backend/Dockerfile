FROM openjdk:17-jdk-slim

ARG JAR_FILE=build/libs/*.jar

# jar 파일 복제
COPY ${JAR_FILE} app.jar

# app.jar 파일을 실행합니다.
ENTRYPOINT ["java","-Duser.timezone=Asia/Seoul", "-jar","/app.jar"]