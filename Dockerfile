FROM node:lts-alpine AS builder
MAINTAINER Thalia Technicie <www@thalia.nu>
LABEL description="Thadmin2 VueJS application"

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
# Include the .env file for build-time environment variables
COPY .env ./.env
COPY . ./
RUN yarn build

FROM nginx
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/dist .
COPY docker.blueprint.env /usr/share/nginx/docker.blueprint.env
COPY resources/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]