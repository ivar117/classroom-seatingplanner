export interface SeatInterface {
    column_index?: number;
    is_occupied:   boolean;
    name?:         string | null;
}

export interface SeatRowInterface {
    row_index?: number;
    seats:      SeatInterface[];
}

export interface SeatingPlanInterface {
    seat_rows: SeatRowInterface[];
}
