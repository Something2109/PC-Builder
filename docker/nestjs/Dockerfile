FROM node:lts-alpine3.21
WORKDIR /usr/local/app

COPY ./ ./

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start:dev"]