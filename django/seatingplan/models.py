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
                    related_name='people'
                )

    class Meta:
        verbose_name_plural = "People"

    def __str__(self):
        return f'Person \"{self.name}\" in {self.seating_plan}'

class SeatRow(models.Model):
    row_index    = models.IntegerField()
    seating_plan = models.ForeignKey(
        SeatingPlan,
        on_delete=models.CASCADE,
        related_name='seat_rows'
    )

    def __str__(self):
        return f'Row {self.row_index} in {self.seating_plan}'

class Seat(models.Model):
    column_index = models.IntegerField()
    is_occupied  = models.BooleanField()
    name         = models.CharField(blank=True, null=True)
    seat_row     = models.ForeignKey(
                    SeatRow,
                    on_delete=models.CASCADE,
                    related_name='seats'
                )

    def __str__(self):
        if self.is_occupied:
            if self.name != None:
                return f'Used seat in column {self.column_index} in {self.seat_row} with name {self.name}'
            else:
                return f'Empty seat in column {self.column_index} in {self.seat_row} with name {self.name}'
        else:
            return f'Outline seat in column {self.column_index} in {self.seat_row} with name {self.name}'
