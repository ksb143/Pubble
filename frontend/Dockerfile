# Node.js 20.11.1 버전을 사용
FROM node:20.11.1 as builder

# 앱 디렉터리 생성
WORKDIR /frontend

COPY package.json .

COPY ./ ./

RUN npm install

RUN npm run build

EXPOSE 5173

CMD ["npm","run","dev"]