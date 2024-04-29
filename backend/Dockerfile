FROM azul/zulu-openjdk:17-latest as build

# Jar 파일을 app.jar라는 이름으로 Docker 컨테이너에 추가합니다.
COPY build/libs/*.jar /app.jar

# app.jar 파일을 실행합니다.
ENTRYPOINT ["java", "-Duser.timezone=Asia/Seoul", "-jar", "/app.jar"]
