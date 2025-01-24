from django.db import models
from django.contrib.auth import get_user_model

class Seating(models.Model):
    user = models.ForeignKey(
            get_user_model(),
            on_delete=models.CASCADE,
            related_name='seatings' # Access seatings from related user
    )

    people = models.JSONField(default=list)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'seatings'
        verbose_name_plural = "Seatings"  # Human-readable name

    def __str__(self):
        return f'Seating by {self.user} on {self.created_at}'
