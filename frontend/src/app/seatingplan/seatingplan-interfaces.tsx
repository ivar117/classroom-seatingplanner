export interface SeatInterfaceIndexed {
    column_index:  number;
    is_occupied:   boolean;
    name?:         string | null;
}

export interface SeatRowInterfaceIndexed {
    row_index:  number;
    seats:      SeatInterfaceIndexed[];
}

export interface SeatInterface {
    is_occupied:   boolean;
    name?:         string | null;
}

export interface SeatRowInterface {
    seats:      SeatInterface[];
}

export interface SeatingPlanInterface {
    seat_rows: SeatRowInterface[];
}
