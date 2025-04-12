from typing import Optional
from django.shortcuts import get_object_or_404
from ninja_extra import Router
from ninja import ModelSchema, Schema

from .models import Person, Seat, SeatRow, SeatingPlan

router = Router()

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


@router.get("seatingplans",
            response=list[GetSeatingPlanSchema],
            summary="Get all seating plans",
            description="Get a list of all seating plans",
            url_name="seating_plans_get")
def get_all_seating_plans(request):
    seating_plans = SeatingPlan.objects.prefetch_related()
    return seating_plans

@router.get("seatingplans/{int:seating_plan_id}",
            response=GetSeatingPlanSchema,
            summary="Get a seating plan",
            description="Get a seating plan with a specific id",
            url_name="seating_plan_get")
def get_seating_plan(request, seating_plan_id:int):
    queryset = SeatingPlan.objects.prefetch_related()
    seating_plan = get_object_or_404(queryset, id=seating_plan_id)
    return seating_plan

@router.post("seatingplans",
             summary="Add a seating plan",
             description="Creates a new seating plan and \
             a list of people from the given names",
             url_name="seating_plan_add")
def post_seating_plan(request, seating_plan: PostSeatingPlanSchema):
    create_seating_plan(seating_plan)
    return seating_plan

def create_seating_plan(seating_plan: PostSeatingPlanSchema):
    seating_plan_obj = SeatingPlan.objects.create(user_id=seating_plan.user_id)
    for row_index in range(len(seating_plan.seat_rows)):
        seat_row = seating_plan.seat_rows[row_index]
        seat_row_obj = SeatRow.objects.create(
            seating_plan=SeatingPlan.objects.get(id=seating_plan_obj.id),
            row_index=row_index + 1
        )

        for column_index in range(len(seat_row.seats)):
            seat = seat_row.seats[column_index]
            seat_obj = Seat.objects.create(
                name=seat.name,
                column_index=column_index + 1,
                is_occupied=seat.is_occupied,
                seat_row = SeatRow.objects.get(id=seat_row_obj.id)
            )

            # Create a Person object if the seat is occupied and has a name
            if seat.is_occupied == True and seat.name != None:
                Person.objects.create(
                    name=seat.name,
                    used=True,
                    seating_plan=SeatingPlan.objects.get(id=seating_plan_obj.id)
                )

    return seating_plan_obj
