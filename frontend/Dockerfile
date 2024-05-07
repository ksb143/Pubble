# Node.js 20.11.1 버전을 사용
FROM node:lts-alpine as build-stage
# 앱 디렉터리 생성

WORKDIR /frontend
COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/homepage.conf /etc/nginx/conf.d/homepage.conf`

COPY --from=build-stage ./frontend/dist /usr/share/nginx/html
EXPOSE 80
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
