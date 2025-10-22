from typing import TypedDict

class SeatType(TypedDict):
    """Define a Seat dict.

    Attributes
    ----------
    "is_occupied" : bool
        indicates the occupied status of
        the seat
    "name": str | None
        the name of the person who occupies
        the seat

    A seat can have one of three states: "outline", "empty",
    or "person". See the below usage guide for how each
    state is implemented.

    Usage::

        # Defines a seat with state "outline"
        seat: SeatType = {"is_occupied": False, "name": None}
        # Defines a seat with state "empty".
        seat: SeatType = {"is_occupied": True, "name": None}
        # Defines a seat with state "person"
        seat: SeatType = {"is_occupied": True, "name": "name"}
    """

    is_occupied: bool
    name: str | None

class SeatRowType(TypedDict):
    """Define a SeatRow dict.
    Used together with SeatType.

    Attributes
    ----------
    "seats" : list[SeatType]
        a list of seats

    Usage::

        seat: SeatType = {"is_occupied": True, "name": "name"}
        seat_row: SeatRowType = {"seats": [seat]}
    """

    seats: list[SeatType]

class SeatingPlanType(TypedDict):
    """Define a SeatingPlan dict.
    Used together with SeatRowType and SeatType.

    Attributes
    ----------
    "seat_rows" : list[SeatRowType]
        a list of seat rows
    "name" : str | None
        the name of the seating plan

    Usage::

        seat: SeatType = {"is_occupied": True, "name": "name"}
        seat_row: SeatRowType = {"seats": [seat]}
        seating_plan: SeatingPlanType = {"seat_rows": [seat_row], "name": "Seating plan"}
    """

    seat_rows: list[SeatRowType]
    name: str | None
