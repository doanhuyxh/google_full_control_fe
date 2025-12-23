# Dockerfile for Next.js Application
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Build Next.js application
RUN npm run build

# Expose port
EXPOSE 3000

# Start Next.js application
CMD ["npm", "start"]
