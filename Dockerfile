# syntax=docker.io/docker/dockerfile:1.7-labs
# ^this line above must be the first line - it enables the --exclude flag for COPY

# Use Node.js runtime as builder base image.
# Since the built app is platform-agnostic, we use the host architecture
# even if we are cross-building the image.
FROM --platform=$BUILDPLATFORM node:21 AS builder

WORKDIR /opt/luna

# Install dependencies
COPY package*.json ./
RUN npm install

# Build LUNA for production
COPY --exclude=nginx.conf . .

ARG DEPLOYMENT_ENVIRONMENT=production
ENV DEPLOYMENT_ENVIRONMENT ${DEPLOYMENT_ENVIRONMENT}

RUN npm run build:$DEPLOYMENT_ENVIRONMENT

# Use Nginx on Alpine as runner base image
FROM nginx:alpine

# Copy bundled app to Nginx' default directory
COPY --from=builder /opt/luna/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
