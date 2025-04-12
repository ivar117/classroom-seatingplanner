from django.test import TestCase
from ninja_extra.testing import TestClient
from django.contrib.auth.models import User
import json

from .api import router as seating_plan_router
from .models import *

class SeatingPlanApiTest(TestCase):
    """Test seating plan related Django Ninja API endpoints"""

    def setUp(self):
        self.client = TestClient(seating_plan_router)

        # Create an example user to be tested on with
        # the seating plan test data
        self.user = User.objects.create_user(username='test',
                                    email='test@example.com',
                                    password='password')

        # Seating plan test data to perform POST requests with
        self.seating_plan_data = {
            "user_id":   self.user.id,
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
            ]
        }

    def test_post_seating_plan(self):
        ## Test seatingplans POST request endpoint ##

        # Perform a POST request to create a new seating plan
        post_response = self.client.post(
            "seatingplans",
            json.dumps(self.seating_plan_data),
            content_type="application/json"
        )

        # Verify that the POST request was successful
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
                "user_id":   seating_plan_obj.user_id,
                "seat_rows": seating_plan_rows,
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
        ## Test seatingplans/{seating_plan_id} GET request endpoint ##

        # Perform a POST request to create a new seating plan
        post_response = self.client.post(
            "seatingplans",
            json.dumps(self.seating_plan_data),
            content_type="application/json"
        )

        self.assertEqual(post_response.status_code, 200)

        # Perform a GET request for a seating plan with a specific id
        get_response = self.client.get("seatingplans/1")

        self.assertEqual(get_response.status_code, 200)

        seating_plan_rows = []
        seat_row_index = 1

        # Go through and verify the data in each seat row in the response data,
        # while verifying created row_index and column_index values
        for seat_row in get_response.json()["seat_rows"]:
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
                "user_id":   get_response.json()["user_id"],
                "seat_rows": seating_plan_rows,
            }
        )

    def test_get_seating_plans(self):
        ## Test seatingplans GET request endpoint ##

        # Perform a POST request to create a new seating plan
        post_response = self.client.post(
            "seatingplans",
            json.dumps(self.seating_plan_data),
            content_type="application/json"
        )

        self.assertEqual(post_response.status_code, 200)

        # Perform a GET request for all the created seating plans
        get_response = self.client.get("seatingplans")

        self.assertEqual(get_response.status_code, 200)

        # Verify the length of the response data
        self.assertEqual(len(get_response.json()), 1)

        # Create a new set of seating plan test data
        new_seating_plan_data = {
            "user_id":   self.user.id,
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
            ]
        }

        # Perform another seating plan POST request
        post_response = self.client.post(
            "seatingplans",
            json.dumps(new_seating_plan_data),
            content_type="application/json"
        )

        self.assertEqual(post_response.status_code, 200)

        get_response = self.client.get("seatingplans")

        # Verify that the length of the response data is now 2
        self.assertEqual(len(get_response.json()), 2)
