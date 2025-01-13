FROM node:alpine3.21

WORKDIR /usr/local/app

COPY ./docker/nextjs/package.json ./
COPY ./docker/nextjs/package-lock.json ./

RUN npm install

COPY ./app ./app
COPY ./components ./components
COPY ./models ./models
COPY ./public ./public
COPY ./utils ./utils
COPY next-env.d.ts ./
COPY next.config.js ./
COPY postcss.config.js ./
COPY tailwind.config.js ./
COPY ./docker/nextjs/tsconfig.json ./

EXPOSE 3000

CMD ["npm" "run" "dev"]