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

import styles from './style.module.css';

interface Seat {
    type: string;
    name?: string;
}

interface SeatRow {
    seats: Seat[];
}

export async function FetchData(url: string): Promise<JSON> {
    const res = await fetch(url) as Response;
    const data = await res.json() as JSON;
    return data;
};

const SeatingRow = ({row}: {row: SeatRow}): JSX.Element => {
    let groupElements = [] as JSX.Element[];
    let prevSeatType = null as string | null;
    let seats = row.seats as Seat[];

    return (
        <div className={styles["seating-row"]}>
            {seats.map((seat: Seat, j: number) => {
                let nextSeatType: string | null;
                // Set proceeding seat type if it's not the last seat of the current row
                if (j != seats.length -1) {
                    nextSeatType = seats[j+1].type as string;
                }
                else {
                    nextSeatType = null;
                }

                if (seat.type === 'outline') {
                    prevSeatType = seat.type as string;
                    return <div key={j} title="Add New Seat" className={styles["seat-outline"]}></div>;
                }
                else if (seat.type === 'empty' || seat.type === 'used') {
                    // Add seat to list until next seat type is different or if it is the end of seating row
                    groupElements.push(
                        <div key={j} className={styles["seat-container"]}>
                            <div title="Empty Seat" className={`
                                ${styles.seat}
                                ${prevSeatType != seat.type && styles.first || prevSeatType === null && styles.first}
                                ${nextSeatType != seat.type && styles.last || nextSeatType === null && styles.first}
                            `}></div>
                            {seat.type == 'used' &&
                                <div className={`
                                    ${styles["person-block"]}
                                    ${prevSeatType != seat.type && styles.first || prevSeatType === null && styles.first}
                                    ${nextSeatType != seat.type && styles.last || nextSeatType === null && styles.first}
                                `}>
                                    <div className={styles.name}>{seat.name}</div>
                                </div>
                            }
                            {nextSeatType === seat.type && nextSeatType != null && <div className={styles["seat-separator"]}></div>}
                        </div>
                    );

                    prevSeatType = seat.type as string;
                    if (nextSeatType != seat.type || nextSeatType === null) {
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

export default function GenerateSeatingArrangement(): JSX.Element | null {
    const searchParams = useSearchParams() as ReadonlyURLSearchParams;
    const seatplanId = searchParams.get('id') as string;
    const DJANGO_API_SEATINGPLAN_URL = `http://localhost:8001/api/seatingplans/${seatplanId}` as string;

    const [seatingArrangement, setSeatingArrangement] = useState<SeatRow[]>([]);

    useEffect(() => {
        FetchData(DJANGO_API_SEATINGPLAN_URL)
            .then((data: JSON) => {
                setSeatingArrangement(data.seat_rows);
            })
            .catch(error => {
                console.error('Error fetching seating plan data:', error);
            })
    }, [seatplanId]);

    return (
        <>
            {seatingArrangement.map((row: SeatRow, i: number) => (
                <SeatingRow key={i} row={row} />
            ))}
        </>
    );
}