import csv
from io import StringIO
from .seatingplan_types import SeatingPlanType, SeatRowType, SeatType

def parse_seatingplan_csv(csv_string: str, name: str | None = None) -> SeatingPlanType:
    '''Convert a csv string representing a seating plan
    to a dictionary'''

    delim = ','
    csv_empty_seat: str = '\"\"'

    buff = StringIO(csv_string)
    reader = csv.reader(buff, delimiter=delim, quotechar="'")

    seating_plan_dict: SeatingPlanType = {"seat_rows": [], "name": name}

    for row in reader:
        current_csv_seat_row: SeatRowType = {"seats": []}

        for column in row:
            if column.isspace() or len(column) == 0:
                current_csv_seat: SeatType = {"is_occupied": False, "name": None}
            elif column == csv_empty_seat:
                current_csv_seat: SeatType = {"is_occupied": True, "name": None}
            else:
                current_csv_seat: SeatType = {"is_occupied": True, "name": column}

            current_csv_seat_row["seats"].append(current_csv_seat)

        seating_plan_dict["seat_rows"].append(current_csv_seat_row)

    return seating_plan_dict
