# Use official Node.js 22 Alpine as base image (lightweight & secure)
FROM node:22-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for efficient caching)
COPY package.json package-lock.json ./

# Install only production dependencies (avoids unnecessary dev dependencies)
RUN npm install --only=production

# Copy the rest of the backend files
COPY . .

# Expose the port your Express app runs on (e.g., 3000)
EXPOSE 5000

# Use environment variables (important for secrets like DB credentials)
ENV NODE_ENV=production

# Start the application
CMD ["node", "server.js"]