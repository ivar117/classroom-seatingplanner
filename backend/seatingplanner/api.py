from ninja import Schema
from ninja_extra import NinjaExtraAPI, Router
from ninja_jwt.authentication import JWTAuth
from ninja_jwt.controller import NinjaJWTDefaultController

from django.contrib.auth import get_user_model
from typing import Optional

from seatingplan.api import router as seatingplan_router

api = NinjaExtraAPI(urls_namespace="Main api")
api.register_controllers(NinjaJWTDefaultController)

api.add_router("", seatingplan_router)

class UserSchema(Schema):
    username: str
    email:    Optional[str] = None
    password: str

router = Router()

@router.post("user",
             summary="Create a new user",
             description="Creates a new user with a \
             username, password and an (optional) email",
             url_name="user_add",)
def create_user(request, user: UserSchema):
    get_user_model().objects.create_user(
        username=user.username,
        password=user.password,
        email=user.email
    )
    return user

api.add_router("", router)
