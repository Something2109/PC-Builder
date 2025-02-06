FROM nginx:stable-alpine3.20-perl as BASE

WORKDIR /etc/nginx/

COPY nginx.conf ./

FROM base AS dev

COPY ./dev ./conf.d

FROM base AS prod

COPY ./prod ./conf.d