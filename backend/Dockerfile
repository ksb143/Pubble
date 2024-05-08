FROM docker
COPY --from=docker/buildx-bin:latest /buildx /usr/libexec/docker/cli-plugins/docker-buildx

FROM azul/zulu-openjdk:17-latest as build

# Jar 파일을 app.jar라는 이름으로 Docker 컨테이너에 추가합니다.
COPY build/libs/*.jar app.jar

EXPOSE 443

# app.jar 파일을 실행합니다.
ENTRYPOINT ["java", "-Xdebug", "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:9091", "-Duser.timezone=Asia/Seoul", "-jar", "app.jar"]
