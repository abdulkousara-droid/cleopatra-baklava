#!/bin/sh
set -e

echo "Running migrations..."
php artisan migrate:refresh --force


echo "Caching config..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Starting supervisor..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisor.conf
