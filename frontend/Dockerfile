# Node.js 20.11.1 버전을 사용
FROM node:20.11.1 AS builder

# 앱 디렉터리 생성
WORKDIR /app

COPY package.json .
COPY package-lock.json .

COPY . .

RUN npm install
RUN npm run build

FROM nginx:latest

COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]