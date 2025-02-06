FROM node:alpine3.21 AS base

WORKDIR /usr/local/app

COPY ./docker/nextjs/package.json ./
COPY ./docker/nextjs/package-lock.json ./

RUN npm install

COPY ./app ./app
COPY ./components ./components
COPY ./public ./public
COPY ./utils ./utils
COPY next-env.d.ts ./
COPY next.config.js ./
COPY postcss.config.js ./
COPY tailwind.config.js ./
COPY ./docker/nextjs/tsconfig.json ./

EXPOSE 3000

ENTRYPOINT [ "npm", "run" ]

FROM base AS dev

CMD ["dev"]

FROM base as prod

RUN npm run build

CMD ["start"]