# Use the official Node.js image
FROM node:18.13

# Create and set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

RUN npm install -g pnpm

# Install app dependencies
RUN pnpm i

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Define the command to run your app
CMD ["node", "main.js"]
