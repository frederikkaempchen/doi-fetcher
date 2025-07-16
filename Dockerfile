# Use official Node.js LTS image
FROM node:20-alpine

# Create app directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of your app code
COPY fetch-dois.js ./

# Run the script when the container starts
CMD ["node", "fetch-dois.js"]
