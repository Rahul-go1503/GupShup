# Use an official Node.js image to build the frontend
FROM node:22-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for efficient caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the frontend files
COPY . .

# Build the React application
RUN npm run build

# Use Nginx to serve the frontend
FROM nginx:alpine

# Copy the built React files to Nginx's default HTML directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for the web server
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]