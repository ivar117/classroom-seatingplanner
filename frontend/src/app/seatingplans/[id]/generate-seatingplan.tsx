"use client"

import {
    JSX,
    useState,
    useEffect,
} from 'react';
import useSWR, { SWRResponse } from "swr"
import { useParams } from "next/navigation"
import {SeatingPlanInterface,
        SeatRowInterfaceIndexed,
        SeatInterfaceIndexed
} from '@/app/seatingplans/seatingplan-interfaces';

import styles from '@/app/css/seatingplan.module.css';
import fetcher from '@/lib/fetcher';
import { useAuth } from '@/components/auth-provider';

const SeatingRow = ({row}: {row: SeatRowInterfaceIndexed}): JSX.Element => {
    let groupElements = [] as JSX.Element[];
    let prevSeatOccupiedState = null as boolean | null;
    let nextSeatOccupiedState: boolean | null;

    // Sort seats according to seat column indexes
    const seats = row.seats.sort((a: SeatInterfaceIndexed, b: SeatInterfaceIndexed): number => {
        return a.column_index - b.column_index;
    }) as SeatInterfaceIndexed[];

    return (
        <div className={styles["seating-row"]}>
            {seats.map((seat: SeatInterfaceIndexed, j: number) => {
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

export default function GenerateSeatingPlan(): JSX.Element {
    const [seatingPlanObject, SetSeatingPlanObject] = useState<SeatingPlanInterface>({seat_rows: []});

    const params = useParams<{ id: string }>();
    const paramsIdString = params.id as string;

    const DJANGO_API_SEATINGPLAN_URL = "/api/seatingplans/" + paramsIdString as string;

    const {data, error} = useSWR(DJANGO_API_SEATINGPLAN_URL, fetcher) as SWRResponse;
    const auth = useAuth();

    useEffect((): void => {
        if (error?.status === 401) {
            auth.loginRequiredRedirect();
        }
        else if (data && data.seat_rows) {
            SetSeatingPlanObject(data);
        }
    }, [data, auth, error]);

    const seatingPlanRows = seatingPlanObject.seat_rows as SeatRowInterfaceIndexed[];

    seatingPlanRows.sort((a: SeatRowInterfaceIndexed, b: SeatRowInterfaceIndexed): number => {
        return a.row_index - b.row_index;
    });

    return (
        <>
            {seatingPlanRows.map((row: SeatRowInterfaceIndexed, i: number): JSX.Element => (
                <SeatingRow key={i} row={row} />
            ))}
        </>
    );
}

export function GenerateSeatingPlanFromObject(seatingPlanObject: SeatingPlanInterface): JSX.Element {
    const seatingPlanRows = seatingPlanObject.seat_rows as SeatRowInterfaceIndexed[];

    seatingPlanRows.sort((a: SeatRowInterfaceIndexed, b: SeatRowInterfaceIndexed): number => {
        return a.row_index - b.row_index;
    });

    return (
        <>
            {seatingPlanRows.map((row: SeatRowInterfaceIndexed, i: number): JSX.Element => (
                <SeatingRow key={i} row={row} />
            ))}
        </>
    );
}
