# ==========================================
# Step 1: Build Frontend Assets (Vite)
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ==========================================
# Step 2: Build Production PHP Application
# ==========================================
FROM php:8.4-fpm-alpine

# Install system dependencies, Nginx, Supervisor, and Postgres development libraries
RUN apk add --no-cache \
    nginx \
    supervisor \
    postgresql-dev \
    libpq-dev \
    bash \
    && docker-php-ext-install pdo pdo_pgsql

# Set production directory
WORKDIR /var/www/html

# Copy full application context
COPY . .

# Copy compiled frontend assets from the first stage
COPY --from=frontend-builder /app/public/build ./public/build

# Install Composer production dependencies
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Setup custom configuration files for web routing and process management
COPY .docker/nginx.conf /etc/nginx/nginx.conf
COPY .docker/supervisor.conf /etc/supervisor/conf.d/supervisor.conf

# Cache Laravel configurations for maximum production speed
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

# Set strict ownership of the entire directory to the web server user
RUN chown -R www-data:www-data /var/www/html

# Ensure correct write permissions for critical internal storage and caching locations
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisor.conf"]