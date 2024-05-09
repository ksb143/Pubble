# 첫 번째 단계: Node.js 이미지는 사용하지 않고, Jenkins에서 생성된 /dist 디렉토리를 바로 사용
# Jenkins 컨테이너에서 /dist 디렉토리의 파일들을 Docker 컨텍스트로 가져오도록 설정

# 두 번째 단계: NGINX를 사용하여 정적 파일 서빙
FROM nginx:latest

# NGINX 기본 설정 제거
RUN rm /etc/nginx/conf.d/default.conf

# Jenkins에서 빌드된 정적 파일 복사
# 이 경로는 Jenkins 파이프라인에서 Docker 이미지를 빌드할 때 지정된 컨텍스트 내에 /dist 폴더가 포함되어 있어야 합니다.
COPY dist/ /usr/share/nginx/html

# 사용자 정의 NGINX 설정 파일 복사 (옵션)
COPY default.conf /etc/nginx/conf.d/

# 포트 80과 443을 열기
EXPOSE 80 443

# NGINX를 foreground에서 실행
CMD ["nginx", "-g", "daemon off;"]
