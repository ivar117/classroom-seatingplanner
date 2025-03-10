from django.db import models
from django.contrib.auth import get_user_model

class SeatingPlan(models.Model):
    user = models.ForeignKey(
            get_user_model(),
            on_delete=models.CASCADE,
            related_name='seatings' # Access seatings from related user
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'seatings'
        verbose_name_plural = "Seating Plans" # Human-readable name

    def __str__(self):
        return f'Seating plan by {self.user} on {self.created_at}'

class Person(models.Model):
    name         = models.CharField()
    used         = models.BooleanField()
    seating_plan = models.ForeignKey(
                    SeatingPlan,
                    on_delete=models.CASCADE,
                    blank=True,
                    null=True,
                    related_name='people'
                )

    class Meta:
        verbose_name_plural = "People"

    def __str__(self):
        return f'Person \"{self.name}\" in {self.seating_plan}'

class SeatRow(models.Model):
    seating_plan = models.ForeignKey(
        SeatingPlan,
        on_delete=models.CASCADE,
        related_name='seat_rows'
    )

    def __str__(self):
        # Get the row number for this SeatRow object in related SeatingPlan object
        seatrows = self.seating_plan.seat_rows.all()
        for seatrow_index in range(len(seatrows)):
            if seatrows[seatrow_index] == self:
                break

        return f'Row {seatrow_index + 1} in {self.seating_plan}'

class Seat(models.Model):
    SEAT_TYPES = {
        'outline': 'Outline',
        'empty':   'Empty',
        'used':    'Used',
    }

    type     = models.CharField(choices=SEAT_TYPES)
    name     = models.CharField(blank=True, null=True)
    seat_row = models.ForeignKey(
                SeatRow,
                on_delete=models.CASCADE,
                related_name='seats'
            )

    def __str__(self):
        # Get the column number for this Seat object in related SeatRow object
        seats = self.seat_row.seats.all()
        for seat_column_index in range(len(seats)):
            if seats[seat_column_index] == self:
                break

        return f'{self.SEAT_TYPES[self.type]} seat in column {seat_column_index + 1} in {self.seat_row}'
