FROM azul/zulu-openjdk:17-latest as build

ARG JAR_FILE=build/libs/pubble-0.0.1-SNAPSHOT.jar

# Jar 파일을 app.jar라는 이름으로 Docker 컨테이너에 추가합니다.

COPY ${JAR_FILE} app.jar

# app.jar 파일을 실행합니다.
ENTRYPOINT ["java", "-Xdebug", "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:9091", "-Duser.timezone=Asia/Seoul", "-jar", "app.jar"]
