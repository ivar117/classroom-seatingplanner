from django.urls import path

from . import views
from . import api

urlpatterns = [
    path("<int:seating_id>/", views.index, name="seating"),
    path("api/", api.api.urls, name="api"),
]
