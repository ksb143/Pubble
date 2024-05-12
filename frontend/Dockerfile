# Node.js 20.11.1 버전을 사용
FROM node:lts-alpine as build-stage
# 앱 디렉터리 생성

WORKDIR /frontend
COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build

EXPOSE 5173

CMD ["npm","run","dev"]
