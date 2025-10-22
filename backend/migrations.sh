python manage.py makemigrations seatingplan
python manage.py migrate seatingplan
python manage.py shell < tools/create_superuser.py
python manage.py collectstatic --noinput
