from django.contrib import admin

from .models import Person, SeatingPlan, SeatRow, Seat

class SeatInline(admin.TabularInline):
    model = Seat
    extra = 0

class SeatRowInline(admin.TabularInline):
    model = SeatRow
    extra = 0
    inlines = [SeatInline]

class PersonInline(admin.TabularInline):
    model = Person
    extra = 0

@admin.register(SeatingPlan)
class SeatingPlanAdmin(admin.ModelAdmin):
    inlines = [SeatRowInline, PersonInline]

@admin.register(SeatRow)
class SeatRowAdmin(admin.ModelAdmin):
    inlines = [SeatInline]

admin.site.register(Seat)
admin.site.register(Person)
