FROM node

# 앱 디렉터리 생성
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# 앱 의존성 설치
COPY package.json /usr/src/app/
RUN npm install

# 앱 소스 추가
COPY . /usr/src/app

EXPOSE 30000

CMD [ "npm", "start" ]
