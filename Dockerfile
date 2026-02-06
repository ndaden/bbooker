# Use the official Node.js image with Node 16
FROM node:18.13 AS build

# Create and set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the app's source code to the working directory
COPY . .

# Build-time environment (Rspack uses process.env.* at build time)
ARG PUBLIC_API_URL=http://localhost:3002
ENV PUBLIC_API_URL=$PUBLIC_API_URL
ENV NODE_ENV=production

# Build the app for production
RUN npm run build

# Use NGINX as a lightweight server to serve the static files
FROM nginx:latest

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

# Copy the built app from the previous stage to the NGINX web server directory
COPY --from=build /usr/src/app/public .
COPY --from=build /usr/src/app/conf/nginx.conf /etc/nginx/conf.d/default.conf

# Start NGINX and serve the app
CMD ["nginx", "-g", "daemon off;"]
