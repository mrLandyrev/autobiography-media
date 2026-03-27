FROM node:24.11.0 AS build

WORKDIR /app
COPY ./package-lock.json ./package.json ./
RUN npm ci

COPY --exclude=nginx.conf ./ ./
RUN npm run build

FROM nginx:1.29.7

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build/ /usr/share/nginx/html/