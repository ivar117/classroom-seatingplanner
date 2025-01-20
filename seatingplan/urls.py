from django.urls import path

from . import views

urlpatterns = [
    path("<int:seating_id>/", views.index, name="seating"),
]
