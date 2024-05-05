FROM node:latest as builder
WORKDIR /app
# 도커컨테이너 내부에 /app디렉토리를 만들고 작업 디렉토리로 설정
COPY package.json .
COPY package-lock.json .
COPY . .
# 현재 디렉토리에 있는 모든 파일,디렉토리를 /app으로 복사
RUN npm install
RUN npm run build
# /app/dist 디렉토리에 빌드된 정적 파일들을 생성함

# nginx 이미지를 사용합니다. 뒤에 tag가 없으면 latest 를 사용합니다.
FROM nginx

COPY --from=builder /app/dist /usr/share/nginx/html
#첫번째 스테이지에서 생성된 /app/dist내용을 현재 스테이지의 /usr/share/nginx/html로 옮김

# container 실행 시 자동으로 실행할 command. nginx 시작함
CMD ["nginx", "-g", "daemon off;"]