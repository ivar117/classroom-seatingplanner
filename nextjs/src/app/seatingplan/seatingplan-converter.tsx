/*
 This module handles converting to and from seating plans
 to and from different formats, and deals with exports.
 */

"use client"

import {RefObject} from "react";
import {SeatingPlanInterface,
        SeatRowInterface,
        SeatInterface
} from "./seatingplan-interfaces";

export default function GenerateObjectFromSeatingPlan(seatingGridRef: RefObject<HTMLElement | null>): object {
    const seatingPlanObject = {seat_rows: []} as SeatingPlanInterface;
    const seatingGridRows = seatingGridRef.current?.children as HTMLCollectionOf<HTMLElement>;

    for (const rowElement of seatingGridRows ) {
        const seatRowObject = {seats: []} as SeatRowInterface;

        for (const columnElement of rowElement.children) {
            let seatObject = {} as SeatInterface;

            if (columnElement.id == "seat-outline") {
                seatObject.is_occupied = false;
                seatObject.name = null;

                seatRowObject.seats.push(seatObject)
            }
            else {
                /* If not a seat-outline, then current seatObject
                 * is a seat-group element.
                 */
                const seatGroupItems = columnElement.children as HTMLCollectionOf<HTMLElement>;

                for (const seatContainer of seatGroupItems) {
                    seatObject.is_occupied = true;
                    const seatContainerItems = seatContainer.children as HTMLCollectionOf<HTMLElement>;

                    if (seatContainerItems.namedItem("seat-person")) {
                        const seatPersonElement = seatContainerItems.namedItem("seat-person") as HTMLElement;
                        const seatName = seatPersonElement.children.namedItem("name")?.textContent as string;
                        seatObject.name = seatName;
                    }
                    else {
                        seatObject.name = null;
                    }

                    seatRowObject.seats.push(seatObject)
                    seatObject = {} as SeatInterface;
                }
            }
        };
        seatingPlanObject.seat_rows.push(seatRowObject)
    };
    return seatingPlanObject;
}

export function GenerateCsvFromSeatingPlan(seatingGridRef: RefObject<HTMLElement | null>): string {
    const DELIM = "," as string;
    const csvEmptySeatString = "\"\"" as string;
    let csvString = "" as string;

    const seatingPlanObject = GenerateObjectFromSeatingPlan(seatingGridRef) as SeatingPlanInterface;

    seatingPlanObject.seat_rows.forEach((seatRow: SeatRowInterface) => {
        const seats = seatRow.seats as SeatInterface[];

        seats.forEach((seatColumn: SeatInterface) => {
            if (!seatColumn.is_occupied) {
                csvString += " " + DELIM;
            }
            else {
                if (seatColumn.name != null) {
                    csvString += seatColumn.name + DELIM;
                }
                else {
                    csvString += csvEmptySeatString + DELIM;
                }
            }
        });
        csvString += "\n";
    });

    return csvString;
}

export function ExportSeatingPlanAsCsv(seatingGridRef: RefObject<HTMLElement | null>) {
    const seatingPlanCsvString = GenerateCsvFromSeatingPlan(seatingGridRef);

    const filename = "seating-plan.csv" as string;
    const contentType = 'text/csv;charset=utf-8,' as string;
    const link = document.createElement('a') as HTMLAnchorElement;

    link.download = filename;
    link.href = 'data:' + contentType + encodeURIComponent(seatingPlanCsvString);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
