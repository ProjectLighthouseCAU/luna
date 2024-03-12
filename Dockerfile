# Use Node.js runtime as builder base image
FROM node:21 AS builder

WORKDIR /opt/luna

# Install dependencies
COPY package*.json ./
RUN npm install

# Build LUNA for production
COPY . .
RUN npm run build

# Use Nginx on Alpine as runner base image
FROM nginx:alpine

# Copy bundled app to Nginx' default directory
COPY --from=builder /opt/luna/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
