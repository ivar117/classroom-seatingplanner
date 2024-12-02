from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.template import loader

from .models import Seating

def index(request, seating_id):
    seating = get_object_or_404(Seating, id=seating_id)
    people = seating.people
    template = loader.get_template("seatingplan/index.html")
    context = {
            "people": people,
    }
    return HttpResponse(template.render(context, request))
