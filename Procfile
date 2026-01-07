web: cd backend && python manage.py migrate --noinput && gunicorn qargo_notes.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --log-level info
