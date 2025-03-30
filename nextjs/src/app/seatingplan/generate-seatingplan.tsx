"use client"

import {
    JSX,
    useState,
    useEffect,
} from 'react';
import {
    useSearchParams,
    ReadonlyURLSearchParams,
} from 'next/navigation';
import {SeatingPlanInterface,
        SeatRowInterface,
        SeatInterface
} from "./seatingplan-interfaces";

import styles from './style.module.css';

export async function FetchSeatingPlanData(url: string): Promise<SeatingPlanInterface> {
    const res = await fetch(url) as Response;
    const data = await res.json() as SeatingPlanInterface;
    return data;
};

const SeatingRow = ({row}: {row: SeatRowInterface}): JSX.Element => {
    let groupElements = [] as JSX.Element[];
    let seats = [] as SeatInterface[];
    let prevSeatOccupiedState = null as boolean | null;
    let nextSeatOccupiedState: boolean | null;

    // Sort seats according to seat column indexes
    seats = row.seats.sort(function(a, b) {
        return a.column_index - b.column_index;
    })

    return (
        <div className={styles["seating-row"]}>
            {seats.map((seat: SeatInterface, j: number) => {
                /* Set proceeding seat occupied state if it
                 * is not the last seat of the current row
                 */
                if (j != seats.length -1) {
                    nextSeatOccupiedState = seats[j+1].is_occupied as boolean;
                }
                else {
                    nextSeatOccupiedState = null;
                }

                if (seat.is_occupied === false) {
                    prevSeatOccupiedState = seat.is_occupied as boolean;
                    return <div key={j} id="seat-outline" title="Add New Seat" className={styles["seat-outline"]}></div>;
                }
                else if (seat.is_occupied === true) {
                    /* Add seat to list until next seat occupied state is different
                     * or if the end of the current seating row is reached
                     */
                    groupElements.push(
                        <div key={j} className={styles["seat-container"]}>
                            <div id="seat-empty" title="Empty Seat" className={`
                                ${styles.seat}
                                ${prevSeatOccupiedState != seat.is_occupied && styles.first || prevSeatOccupiedState === null && styles.first}
                                ${nextSeatOccupiedState != seat.is_occupied && styles.last || nextSeatOccupiedState === null && styles.first}
                            `}></div>
                            {seat.name != null &&
                                <div id="seat-person" className={`
                                    ${styles["person-block"]}
                                    ${prevSeatOccupiedState != seat.is_occupied && styles.first || prevSeatOccupiedState === null && styles.first}
                                    ${nextSeatOccupiedState != seat.is_occupied && styles.last || nextSeatOccupiedState === null && styles.first}
                                `}>
                                    <div id="name" className={styles.name}>{seat.name}</div>
                                </div>
                            }
                            {nextSeatOccupiedState === seat.is_occupied && nextSeatOccupiedState != null && <div className={styles["seat-separator"]}></div>}
                        </div>
                    );

                    prevSeatOccupiedState = seat.is_occupied as boolean;
                    if (nextSeatOccupiedState != seat.is_occupied || nextSeatOccupiedState === null) {
                        const groupElementsCopy = groupElements as JSX.Element[];
                        groupElements = [];

                        return (
                            <div key={j} className={styles["seat-group"]}>
                                {groupElementsCopy}
                            </div>
                        )
                    }
                    else {
                        return null;
                    }
                }
            })}
        </div> /* .seating-row ends here */
    );
};

export default function GenerateSeatingPlan(): JSX.Element | null {
    const searchParams = useSearchParams() as ReadonlyURLSearchParams;
    const seatPlanId = searchParams.get('id') as string;
    const DJANGO_API_SEATINGPLAN_URL = `http://localhost:8001/api/seatingplans/${seatPlanId}` as string;

    const [seatingPlanObject, SetSeatingPlanObject] = useState<SeatingPlanInterface>({seat_rows: []})

    useEffect(() => {
        FetchSeatingPlanData(DJANGO_API_SEATINGPLAN_URL)
            .then((data: SeatingPlanInterface) => {
                SetSeatingPlanObject(data);
            })
            .catch(error => {
                console.error('Error fetching seating plan data:', error);
            })
    }, [seatPlanId]);

    const seatingPlanRows = seatingPlanObject.seat_rows as SeatRowInterface[];

    // seatingPlanObject.sort(function(a, b) {
    seatingPlanRows.sort(function(a, b) {
        return a.row_index - b.row_index;
    });

    return (
        <>
            {seatingPlanRows.map((row: SeatRowInterface, i: number) => (
                <SeatingRow key={i} row={row} />
            ))}
        </>
    );
}
