from ninja_extra import NinjaExtraAPI, Router

from seatingplan.api import router as seatingplan_router

api = NinjaExtraAPI()

api.add_router("", seatingplan_router)
