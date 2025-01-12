FROM node:lts-alpine3.21
WORKDIR /usr/local/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY controllers ./controllers
COPY crawlers ./crawlers
COPY models ./models
COPY utils ./utils
COPY nest-cli.json ./
COPY tsconfig.json ./

EXPOSE 3000

CMD ["npm", "run", "start:dev"]