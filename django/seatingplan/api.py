from django.shortcuts import get_object_or_404
from ninja_extra import Router
from ninja import ModelSchema

from .models import Person, Seat, SeatRow, SeatingPlan

router = Router()

class PersonSchema(ModelSchema):
    class Meta:
        model = Person
        fields = '__all__'

class SeatSchema(ModelSchema):
    class Meta:
        model = Seat
        fields = '__all__'

class SeatRowSchema(ModelSchema):
    seats: list[SeatSchema]

    class Meta:
        model = SeatRow
        fields = '__all__'

class SeatingPlanSchema(ModelSchema):
    class Meta:
        model = SeatingPlan
        fields = ['id']

    user_id:   int
    seat_rows: list[SeatRowSchema]
    people:    list[PersonSchema]


@router.get("seatingplans", response=list[SeatingPlanSchema])
def get_all_seating_plans(request):
    all_seating_plans = SeatingPlan.objects.prefetch_related()
    return all_seating_plans

@router.get("seatingplans/{seating_id}", response=SeatingPlanSchema)
def get_seating_plan(request, seating_id:int):
    queryset = SeatingPlan.objects.prefetch_related()
    seating_plan = get_object_or_404(queryset, id=seating_id)
    return seating_plan
