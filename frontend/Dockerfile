# 첫 번째 단계: Node.js를 사용하여 프론트엔드 소스 코드 빌드
FROM node:20.11.1 AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 환경 변수 파일과 npm 설정 파일 복사
COPY .env.production ./
COPY .npmrc ./

# package.json과 package-lock.json 파일 복사
COPY package.json ./
COPY package-lock.json ./

# 의존성 설치
RUN npm install

# 애플리케이션 빌드

RUN npm run build || echo "Build failed, but continuing for diagnostics..."
RUN npm run build --verbose

# 두 번째 단계: NGINX를 사용하여 정적 파일 서빙
FROM nginx:latest

# NGINX 기본 설정 제거
RUN rm /etc/nginx/conf.d/default.conf

# 프론트엔드 빌드 디렉토리에서 정적 파일 복사
COPY --from=builder /app/build /usr/share/nginx/html

# 사용자 정의 NGINX 설정 파일 복사
COPY default.conf /etc/nginx/conf.d/

# 포트 80과 443을 열기
EXPOSE 80 443

# NGINX를 foreground에서 실행
CMD ["nginx", "-g", "daemon off;"]
