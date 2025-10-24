export interface PersonInterface {
    name: string;
    used: boolean;
}

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
    name?:     string;
}

export interface SeatingPlanInterfaceExtended {
    seat_rows: SeatRowInterface[];
    name?:     string;
    people:    PersonInterface[];
    id?:       number;
}
