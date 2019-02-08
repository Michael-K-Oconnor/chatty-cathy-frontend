FROM node:10.13-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:stable
COPY --from=build /app/dist/ /dist/
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
# CMD ["nginx -g 'daemon off;'"]
