from ninja_extra import NinjaExtraAPI

from seatingplan.api import router as seatingplan_router

api = NinjaExtraAPI()

api.add_router("/seatingplans", seatingplan_router)
