# Generated by Django 5.1.1 on 2025-03-23 19:52

from django.db import migrations, models
from seatingplan.models import Seat

def seat_convert_field(apps, schema_editor):
    # Convert the int field "type" to bool field "is_occupied"
    for seat in Seat.objects.all():
        if seat.type == 0:
                seat.is_occupied = False
        elif seat.type == 1 or seat.type == 2:
                seat.is_occupied = True
        seat.save()

class Migration(migrations.Migration):

    dependencies = [
        ('seatingplan', '0006_seat_is_occupied'),
    ]

    operations = [
        migrations.RunPython(seat_convert_field),
        migrations.RemoveField(
            model_name='seat',
            name='type',
        ),
        migrations.AlterField(
            model_name='seat',
            name='is_occupied',
            field=models.BooleanField(),
        ),
    ]
