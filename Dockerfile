# Use an official production-ready PHP-FPM image
FROM php:8.3-fpm-alpine

# Install system dependencies & Postgres drivers
RUN alpine-apk-bootstrap && apk add --no-cache \
    nginx \
    supervisor \
    postgresql-dev \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Set working directory
WORKDIR /var/www/html

# Copy project files
COPY . .

# Install production dependencies
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Configure Nginx & Supervisor configuration (Render needs Nginx to route traffic to PHP)
COPY .docker/nginx.conf /etc/nginx/nginx.conf
COPY .docker/supervisor.conf /etc/supervisor/conf.d/supervisor.conf

# Set permissions for Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisor.conf"]