FROM node:20-alpine

WORKDIR /app

# Install system dependencies required for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

# Copy source code
COPY . .

# Clean install to work around Rollup native issue
RUN rm -rf node_modules package-lock.json && npm install

# Optional: disable native Rollup bindings
ENV ROLLUP_NO_NATIVE=true

# Build the frontend
RUN npm run build

# Install serve to host the frontend
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
