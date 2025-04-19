from typing import Optional
from ninja import ModelSchema, Schema

from .models import Person, Seat, SeatRow, SeatingPlan

class GetPersonSchema(ModelSchema):
    class Meta:
        model = Person
        fields = '__all__'

class GetSeatSchema(ModelSchema):
    class Meta:
        model = Seat
        fields = '__all__'

class GetSeatRowSchema(ModelSchema):
    seats: list[GetSeatSchema]

    class Meta:
        model = SeatRow
        fields = '__all__'

class GetSeatingPlanSchema(ModelSchema):
    class Meta:
        model = SeatingPlan
        fields = ['id']

    user_id:   int
    seat_rows: list[GetSeatRowSchema]
    people:    list[GetPersonSchema]

class PostPersonSchema(Schema):
    name: str
    used: bool

class PostSeatSchema(Schema):
    is_occupied:  bool
    name:         Optional[str] = None

class PostSeatRowSchema(Schema):
    seats:     list[PostSeatSchema]

class PostSeatingPlanSchema(Schema):
    user_id:   int
    seat_rows: list[PostSeatRowSchema]
