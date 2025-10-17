from django.test import TestCase
from ninja_extra.testing import TestClient
from ninja_jwt.routers.obtain import obtain_pair_router
import json

from seatingplanner.api import router as user_router
from .api import router as seating_plan_router
from .models import Person, Seat, SeatRow, SeatingPlan

class SeatingPlanApiTest(TestCase):
    """Test seating plan related Django Ninja API endpoints"""
    # Seating plan router client
    client_seatingplan = TestClient(seating_plan_router)
    # User api router client
    client_user = TestClient(user_router)
    # Auth token pair router client
    client_auth = TestClient(obtain_pair_router)


    def setUp(self):
        user_password  = "password"
        user_username  = "test"
        user_data = {
            "username": user_username,
            "email": "test@example.com",
            "password": user_password
        }

        # Perform a POST request to create a new user
        post_user_response = self.client_user.post(
            "user",
            json.dumps(user_data),
            content_type="application/json"
        )

        token_pair_data = {
            "password": user_password,
            "username": user_username,
        }

        # Perform a POST request to obtain auth token pair
        # for the test user
        post_token_response = self.client_auth.post(
            "pair",
            json.dumps(token_pair_data),
            content_type="application/json"
        )

        # Verify that the POST request was successful
        self.assertEqual(post_token_response.status_code, 200)
        # Get auth access token
        self.access_token = post_token_response.json()["access"]

        # Seating plan test data to perform POST requests with
        self.seating_plan_data = {
            "seat_rows": [
                {
                    "seats": [
                        {
                            "is_occupied": True,
                            "name":        "test_name1"
                        }
                    ]
                },
                {
                    "seats": [
                        {
                            "is_occupied": True,
                            "name":        "test_name2"
                        },
                        {
                            "is_occupied": True,
                            "name":        "test_name3"
                        }
                    ]
                }
            ],
            "name": "Seating plan"
        }

    def test_post_seating_plan(self):
        ## Test seatingplans POST request endpoint ##

        # Perform a POST request to create a new seating plan
        post_response = self.client_seatingplan.post(
            "seatingplans",
            json.dumps(self.seating_plan_data),
            content_type="application/json",
            headers={"Authorization": "Bearer " + self.access_token}
        )

        self.assertEqual(post_response.status_code, 200)

        # Get the latest SeatingPlan object created from the POST request
        seating_plan_obj = SeatingPlan.objects.last()
        # Get a list of the SeatRow objects related to the SeatingPlan object
        seating_plan_rows_query = SeatRow.objects.filter(seating_plan=seating_plan_obj)

        seating_plan_rows = []

        # Go through and extract data from each SeatRow object in the query
        for seat_row in seating_plan_rows_query:
            seats = []

            # Go through and extract data from each Seat object related to
            # the current SeatRow object
            for seat in Seat.objects.filter(seat_row=seat_row):
                seats.append(
                    {
                        "is_occupied": seat.is_occupied,
                        "name":        seat.name
                    }
                )

            seating_plan_rows.append(
                {
                    "seats": seats
                }
            )

        # Verify that the test data matches the data extracted
        # from the created objects
        self.assertDictEqual(
            self.seating_plan_data,
            {
                "seat_rows": seating_plan_rows,
                "name":      seating_plan_obj.name,
            }
        )

        # Get a query of the Person objects related to the SeatingPlan object
        people_query = Person.objects.filter(seating_plan=seating_plan_obj)

        # Verify that the created Person objects match the test data
        person_index = 0
        for seat_row in self.seating_plan_data["seat_rows"]:
            for seat in seat_row["seats"]:
                self.assertEqual(seat["name"],        people_query[person_index].name)
                self.assertEqual(seat["is_occupied"], people_query[person_index].used)
                person_index += 1

    def test_get_seating_plan(self):
        ## Test seatingplans/<seating_plan_id> GET request endpoint ##

        # Perform a POST request to create a new seating plan
        post_response = self.client_seatingplan.post(
            "seatingplans",
            json.dumps(self.seating_plan_data),
            content_type="application/json",
            headers={"Authorization": "Bearer " + self.access_token}
        )

        self.assertEqual(post_response.status_code, 200)

        # Get the latest SeatingPlan object created from the POST request
        seating_plan_obj = SeatingPlan.objects.last()
        # Get the id of the SeatingPlan object
        seating_plan_id  = seating_plan_obj.id

        # Perform a GET request for a seating plan with a specific id
        get_response = self.client_seatingplan.get(
            "seatingplans/" + str(seating_plan_id),
            headers={"Authorization": "Bearer " + self.access_token}
        )
        get_response_json = get_response.json()

        self.assertEqual(get_response.status_code, 200)

        seating_plan_rows = []
        seat_row_index = 1

        # Go through and verify the data in each seat row in the response data,
        # while verifying created row_index and column_index values
        for seat_row in get_response_json["seat_rows"]:
            seats = []
            seat_column_index = 1

            for seat in seat_row["seats"]:
                seats.append(
                    {
                        "is_occupied": seat["is_occupied"],
                        "name":        seat["name"]
                    }
                )

                # Verify that the column_index of the seat is correct
                self.assertEqual(seat_column_index, seat["column_index"])
                seat_column_index += 1

            seating_plan_rows.append(
                {
                    "seats": seats
                }
            )

            # Verify that the row_index of the seat row is correct
            self.assertEqual(seat_row_index, seat_row["row_index"])
            seat_row_index += 1

        # Ensure that the data from the GET request response
        # matches the test data
        self.assertDictEqual(
            self.seating_plan_data,
            {
                "seat_rows": seating_plan_rows,
                "name":      get_response_json["name"],
            }
        )

    def test_get_seating_plans(self):
        ## Test seatingplans GET request endpoint ##

        # Perform a POST request to create a new seating plan
        post_response = self.client_seatingplan.post(
            "seatingplans",
            json.dumps(self.seating_plan_data),
            content_type="application/json",
            headers={"Authorization": "Bearer " + self.access_token}
        )

        self.assertEqual(post_response.status_code, 200)

        # Perform a GET request for all the created seating plans
        get_response = self.client_seatingplan.get(
            "seatingplans",
            headers={"Authorization": "Bearer " + self.access_token}
        )

        self.assertEqual(get_response.status_code, 200)

        # Verify the length of the response data
        self.assertEqual(len(get_response.json()), 1)

        # Create a new set of seating plan test data
        new_seating_plan_data = {
            "seat_rows": [
                {
                    "seats": [
                        {
                            "is_occupied": True,
                            "name":        "test_name4"
                        },
                        {
                            "is_occupied": True,
                            "name":        "test_name5"
                        }
                    ]
                },
                {
                    "seats": [
                        {
                            "is_occupied": True,
                            "name":        "test_name6"
                        }
                    ]
                }
            ],
            "name": "Another seating plan"
        }

        # Perform another seating plan POST request
        post_response = self.client_seatingplan.post(
            "seatingplans",
            json.dumps(new_seating_plan_data),
            content_type="application/json",
            headers={"Authorization": "Bearer " + self.access_token}
        )

        self.assertEqual(post_response.status_code, 200)

        get_response = self.client_seatingplan.get(
            "seatingplans",
            headers={"Authorization": "Bearer " + self.access_token}
        )

        # Verify that the length of the response data is now 2
        self.assertEqual(len(get_response.json()), 2)
