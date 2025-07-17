# Use official Node.js LTS image
FROM node:20

# Install nano (text editor)
RUN apt-get update && apt-get install -y nano && rm -rf /var/lib/apt/lists/*

# Create app directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of your app code
COPY . .

# Set permission for run.sh
RUN chmod +x run.sh

# Run the script when the container starts
CMD ["npm", "start"]
