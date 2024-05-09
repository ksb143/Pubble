# NGINX를 사용하여 정적 파일 서빙
FROM nginx:latest

# 기본 NGINX 설정 파일 삭제
RUN rm /etc/nginx/conf.d/default.conf

# frontend/dist에서 NGINX 서버의 html 디렉토리로 정적 파일 복사
COPY dist/ /usr/share/nginx/html

# 사용자 정의 NGINX 설정 파일 복사 (선택적)
COPY default.conf /etc/nginx/conf.d/

# 포트 80과 443 오픈
EXPOSE 80 443

# NGINX 실행
CMD ["nginx", "-g", "daemon off;"]
