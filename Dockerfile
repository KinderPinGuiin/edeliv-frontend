FROM node:18-alpine AS BUILD_IMAGE

# Copy the source files inside the image
WORKDIR /app
COPY . .

# Install the dependencies and build the application
RUN npm install
RUN npm run build

FROM nginx:alpine AS PRODUCTION_IMAGE

# Copy Nginx config
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built files inside an nginx server
COPY --from=BUILD_IMAGE /app/dist /usr/share/nginx/html

EXPOSE 80

# Run the nginx server
CMD ["nginx", "-g", "daemon off;"]
