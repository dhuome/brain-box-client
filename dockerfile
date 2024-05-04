## STAGE -1- BUILD ##
FROM node:18-alpine3.18 AS build
WORKDIR /app
COPY . .
RUN npm cache clean --force
RUN npm install
RUN npm run build

## STAGE -2- NGINX ##
FROM nginx:stable-alpine3.17-slim
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/brain-box-client/browser /usr/share/nginx/html
