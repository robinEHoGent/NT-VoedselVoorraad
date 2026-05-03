# Build Stage
FROM node:lts-alpine AS build
WORKDIR /app

# allow VITE_API_URL to be set in .env of docker-compose.yml
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
    
COPY ./package*.json ./
RUN npm install
COPY . .

RUN npm run build

# Production Stage
FROM nginx:stable-alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]