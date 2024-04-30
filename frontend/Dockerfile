# Node.js 20.11.1 버전을 사용
FROM node:20.11.1

# 앱 디렉터리 생성
WORKDIR /usr/src/app

# 애플리케이션 의존성 파일 복사
# package.json 과 package-lock.json (있을 경우)
COPY package*.json ./

# 패키지 설치
RUN npm install

# 앱 소스 추가
COPY . .

# 앱이 5173 포트에서 실행되도록 설정
EXPOSE 5173

# 앱 실행
CMD ["node", "app.js"]
