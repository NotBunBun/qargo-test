#!/bin/sh
set -e

echo "=== Running migrations ==="
python manage.py migrate --noinput

echo "=== Starting Gunicorn ==="
exec gunicorn qargo_notes.wsgi:application \
    --bind 0.0.0.0:${PORT:-8000} \
    --workers 2 \
    --log-level info \
    --access-logfile - \
    --error-logfile -
