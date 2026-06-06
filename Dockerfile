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

WORKDIR /var/www/html

COPY . .

COPY --from=frontend-builder /app/public/build ./public/build

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-interaction --optimize-autoloader --no-dev

COPY .docker/nginx.conf /etc/nginx/nginx.conf
COPY .docker/supervisor.conf /etc/supervisor/conf.d/supervisor.conf

RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache
RUN sed -i 's/listen = \/.*/listen = 127.0.0.1:9000/g' /usr/local/etc/php-fpm.d/www.conf 2>/dev/null || true

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

CMD ["/entrypoint.sh"]