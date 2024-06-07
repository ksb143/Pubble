CICD 구축용 커밋 파일

1. ci yml 수정
2. gitlab runner container config 수정
3. ci yml test 없이 gradle build 하도록 수정
4. ci yml tag backend -> back 으로 수정
5. runner 전체 초기화하고 다시 시작
6. 테스트용 김효주 커밋
7. backend Docker-in-Docker previleged false 로 gitlab conf toml 변경
8. .gitlab-ci.yml에서 previleged 삭제하고 build 명령어에 현재 디렉토리 . 추가 
9. ERROR: Multi-platform build is not supported for the docker driver 으로 docker buildx driver 사용 방법 추가
10. gitlab conf toml 에 dind 관련 설정 추가
11. export DOCKER_HOST=tcp://docker:2375 는 실행됐는데 로그인 단계에서 에러 발생
    발생한 에러:
    Error saving credentials: rename /root/.docker/config.json4293881916 /root/.docker/config.json: file exists
    해결방법 -> conf toml 변경해서 저장할 mount 제거
12. Jenkins-Gitlab webhook 변경
13. success 테스트용 커밋
