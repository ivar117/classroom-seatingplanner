from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.template import loader

from .models import Seating

def index(request, seating_id):
    seating_plan = get_object_or_404(Seating, id=seating_id)
    people = seating_plan.people
    template = loader.get_template("seatingplan/index.html")
    context = {
            "people": people,
    }
    return HttpResponse(template.render(context, request))
