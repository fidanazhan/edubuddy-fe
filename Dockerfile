# Use official Node.js image
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the React app
RUN npm run build

# Use nginx to serve the static files
# Use the Nginx base image
FROM nginx:stable-alpine

# Copy the build output (dist folder) to Nginx's serving folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration file into the default directory
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

