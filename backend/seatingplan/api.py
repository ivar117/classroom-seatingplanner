from django.shortcuts import get_object_or_404
from ninja_extra import Router
from ninja_jwt.authentication import JWTAuth

from .models import Person, Seat, SeatRow, SeatingPlan
from .schemas import (
    GetSeatingPlanSchema,
    PostSeatingPlanSchema
)

router = Router()

@router.get("seatingplans",
            response=list[GetSeatingPlanSchema],
            summary="Get seating plans",
            description="Get a list of a user's seating plans",
            url_name="seating_plans_get",
            auth=JWTAuth())
def get_all_seating_plans(request):
    seating_plans = SeatingPlan.objects.filter(user=request.user)
    return seating_plans

@router.get("seatingplans/{int:seating_plan_id}",
            response=GetSeatingPlanSchema,
            summary="Get a seating plan",
            description="Get a user's seating plan with a specific id",
            url_name="seating_plan_get",
            auth=JWTAuth())
def get_seating_plan(request, seating_plan_id:int):
    seating_plan = get_object_or_404(SeatingPlan,
                              id=seating_plan_id,
                              user=request.user)
    return seating_plan

@router.post("seatingplans",
             summary="Add a seating plan",
             description="Creates a new seating plan and \
             a list of people from the given names",
             url_name="seating_plan_add",
             auth=JWTAuth())
def post_seatingplan(request, seating_plan: PostSeatingPlanSchema):
    create_seating_plan(seating_plan, request.user)
    return seating_plan


def create_seating_plan(seating_plan: PostSeatingPlanSchema, user) -> object:
    seating_plan_obj = SeatingPlan.objects.create(user=user, name=seating_plan.name)
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
