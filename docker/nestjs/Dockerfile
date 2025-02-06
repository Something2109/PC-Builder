FROM node:lts-alpine3.21 AS base
WORKDIR /usr/local/app

COPY ./docker/nestjs/package.json ./
COPY ./docker/nestjs/package-lock.json ./

RUN npm install

COPY controllers ./controllers
COPY crawlers ./crawlers
COPY models ./models
COPY utils ./utils
COPY nest-cli.json ./
COPY ./docker/nestjs/tsconfig.json ./

EXPOSE 3000

ENTRYPOINT ["npm", "run"]

FROM base AS dev

CMD ["start:dev"]

FROM base AS prod

RUN npm run build

CMD ["start:prod"]