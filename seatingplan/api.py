from django.shortcuts import get_object_or_404
from ninja import NinjaAPI, Schema

from .models import Seating

api = NinjaAPI()

class SeatingPlanSchema(Schema):
    id: int
    user_id: int
    people: list

@api.get("/seatingplans/")
def get_all_seating_plans(request):
    seating_plan_objects = Seating.objects.all()
    seating_plans = []

    for seating_plan_obj in seating_plan_objects:
        seating_plan_dict = SeatingPlanSchema(**seating_plan_obj.__dict__)
        seating_plans.append(seating_plan_dict)

    return seating_plans

@api.get("/seatingplans/{seating_id}")
def get_seating_plan(request, seating_id: int):
    seating_plan = get_object_or_404(Seating, id=seating_id)
    seating_plan_dict = SeatingPlanSchema(**seating_plan.__dict__)
    return seating_plan_dict
