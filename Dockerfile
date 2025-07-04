FROM node:22-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .


RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Sẽ dùng nginx config từ ConfigMap
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]