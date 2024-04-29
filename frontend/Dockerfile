# nginx 이미지 사용
FROM nginx:latest

# 필수 패키지 설치
RUN apt-get update && apt-get install -y curl gnupg

# Node.js 설치
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -  # 예시로 LTS 버전 설정 명령어 사용
RUN apt-get install -y nodejs

# Vite와 TypeScript 설치
RUN npm install -g vite@5.2.10 typescript@5.4.5

# Node.js와 npm이 제대로 설치되었는지 확인
RUN node -v
RUN npm -v

# root에 /app 폴더 생성
RUN mkdir /app

# work dir 고정
WORKDIR /app

# work dir에 build 폴더 생성
RUN mkdir ./build

# host pc의 현재 경로의 build 폴더를 work dir의 build 폴더로 복사
ADD ./build ./build

# nginx의 default.conf 삭제
RUN rm /etc/nginx/conf.d/default.conf

# host pc의 nginx.conf를 아래 경로에 복사
COPY ./nginx.conf /etc/nginx/conf.d

# 80 포트 개방
EXPOSE 80

# container 실행 시 자동으로 실행할 command. nginx 시작함
CMD ["nginx", "-g", "daemon off;"]
