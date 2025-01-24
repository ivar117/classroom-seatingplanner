"use client"

import {
    JSX,
    useState,
    useEffect,
    Fragment
} from "react";
import {
    useSearchParams,
    ReadonlyURLSearchParams,
} from 'next/navigation';
import Image from "next/image";
import styles from "./style.module.css";
import { SearchParams } from "next/dist/server/request/search-params";
import "./variables.css"

export function GenerateSeatOutlinesGrid(columns: number, rows: number): JSX.Element[] {
    const gridArray = Array.from({ length: rows }, (_, idx) => (
        <div className={styles["seating-row"]} key={idx}>
            {Array.from({ length: columns }, (_, seatIdx) => (
                <div key={seatIdx} title="Add New Seat" className={styles["seat-outline"]}></div>
            ))}
        </div>
    )) as JSX.Element[]
    return gridArray
}

export async function FetchSeatingplanData(url: string): Promise<JSON> {
    const res = await fetch(url) as Response;
    const data = await res.json() as JSON;
    return data;
};

export function GenerateSeatingsFromData(): JSX.Element {
    const searchParams = useSearchParams() as ReadonlyURLSearchParams;
    const seatplanId = searchParams.get('id') as string;
    const DJANGO_API_SEATINGPLAN_URL = `http://localhost:8001/api/seatingplans/${seatplanId}` as string;

    const [people, setPeople] = useState<Array<Array<string>>>([]);

    useEffect(() => {
        FetchSeatingplanData(DJANGO_API_SEATINGPLAN_URL)
            .then((data: JSON) => {
                setPeople(data.people);
            })
            .catch(error => {
                console.error('Error fetching seating plan data:', error);
                return;
            })
    }, [seatplanId]);

    return (
        <div className={styles["seating-row"]}>
        {people.length > 0 && people.map((group, i) => (
            <Fragment key={i}>
                <div className={styles["seat-group"]}>
                    {group.map((person, j) => (
                    <div className={styles["seat-container"]} key={j}>
                        <div
                            title="Empty Seat"
                            className={`
                                ${styles.seat}
                                ${j === 0 ? styles.first : ''}
                                ${j === group.length - 1 ? styles.last : ''}
                            `}
                        ></div>
                        <div
                            className={`
                                ${styles["person-block"]}
                                ${j === 0 ? styles.first : ''}
                                ${j === group.length - 1 ? styles.last : ''}
                            `}
                        >
                            <div className={styles.name}>
                                {person}
                            </div>
                        </div>
                        {j !== group.length - 1 && <div className={styles["seat-separator"]}></div>}
                    </div>
                    ))}
                </div>
                <div title="Add New Seat" className={styles["seat-outline"]}></div>
            </Fragment>
        ))}
        </div>
    );
}

export default function Page(): JSX.Element {
    const [isSidebarToggled, setIsSidebarToggled] = useState<boolean>(false);

    const toggleSidebar = (): void => {
        setIsSidebarToggled(!isSidebarToggled);
    };

    const sidebarActionsDisplay = isSidebarToggled ? 'none' : 'flex' as string;
    const sidebarToggleButtonTransform = isSidebarToggled ? 'translateY(-50%) scale(-1, 1)' :  'translateY(-50%) scale(1)' as string;

    const [isExportMenuToggled, setIsExportMenuToggled] = useState<boolean>(false);

    const toggleExportMenu = (): void => {
        setIsExportMenuToggled(!isExportMenuToggled);
    };

    const exportButtonArrowTransform = isExportMenuToggled ? 'scale(1, -1)' :  'scale(1)' as string;

    return (
        <main className={styles["layout-container"]}>
            <div className={styles["sidebar-container"]}>
                <div className={`${styles.sidebar} ${isSidebarToggled ? styles.visible : ''}`}>
                    <div className={styles["sidebar-actions"]} style={{display: sidebarActionsDisplay}}>
                        <div className={styles.toolbar}>
                            <button title="Undo" id={styles["undo-button"]} className={`${styles["toolbar-item"]} ${styles.left}`}>
                                <img src="/images/components/undo.svg" alt="Undo" />
                            </button>
                            <div className={styles["toolbar-separator"]}></div>
                            <button title="Redo" id={styles["redo-button"]} className={styles["toolbar-item"]}>
                                <img src="/images/components/redo.svg" alt="Redo" />
                            </button>
                            <div className={styles["toolbar-separator"]}></div>
                            <button title="Zoom In" className={styles["toolbar-item"]}>
                                <img src="/images/components/zoom-in.svg" alt="Zoom In" />
                            </button>
                            <div className={styles["toolbar-separator"]}></div>
                            <button title="Zoom Out" className={`${styles["toolbar-item"]} ${styles.right}`}>
                                <img src="/images/components/zoom-out.svg" alt="Zoom Out" />
                            </button>
                        </div>

                        <button id={styles["seat-outlines-toggle-button"]} className={styles["sidebar-button"]}>
                            <img src="/images/components/seat-outline.svg" alt="Outline Icon" /> Toggle Seat Outlines
                        </button>
                        <button id={styles["shuffle-seatings-button"]} className={styles["sidebar-button"]}>
                            <img src="/images/components/shuffle.svg" alt="Shuffle Icon" /> Shuffle Seatings
                        </button>
                        <button id={styles["save-button"]} className={styles["sidebar-button"]}>
                            <img src="/images/components/save.svg" alt="Save Icon" /> Save Configuration
                        </button>
                        <div className={styles["export-dropdown-container"]}>
                            <button onClick={toggleExportMenu} id={styles["export-button"]} className={styles["sidebar-button"]}>
                                Export as:
                                <img
                                    src="/images/components/downarrow.svg"
                                    alt="Down Arrow" className={styles["arrow"]}
                                    style={{ marginTop: '3px', transform: exportButtonArrowTransform }}
                                />
                            </button>

                            <div className={`${styles["export-dropdown"]} ${isExportMenuToggled ? styles.visible : ''}`}>
                                <div className={`${styles["dropdown-item"]} ${styles.first}`}>
                                    <img src="/images/components/file-pdf.svg" alt=".pdf icon" /> .pdf file
                                </div>
                                <div className={styles["dropdown-item"]}>
                                    <img src="/images/components/file-png.svg" alt=".png icon" /> .png file
                                </div>
                                <div className={`${styles["dropdown-item"]} ${styles.last}`}>
                                    <img src="/images/components/file-csv.svg" alt=".csv icon" /> .csv file
                                </div>
                            </div>
                        </div>
                    </div> {/* .sidebar-actions ends here */}

                    <button
                        onClick={toggleSidebar}
                        title="Toggle Sidebar"
                        id={styles["toggle-sidebar"]}
                        className={styles.toggle}
                        style={{transform: sidebarToggleButtonTransform }}
                    >
                        <img className={styles.arrow} src="/images/components/leftarrow.svg" alt="Toggle Sidebar" />
                    </button>
                </div> {/* .sidebar ends here */}
            </div> {/* .sidebar-container ends here */}

            <div className={styles["seatplan-container"]}>
                <div className={styles["seating-grid-container"]}>
                    <div className={styles["seating-grid"]}>
                        {/* Create a grid of seat outlines with specified amount of columns and rows */}
                        {GenerateSeatOutlinesGrid(15, 10)}
                        {/* Create seating plans from data */}
                        {GenerateSeatingsFromData()}
                    </div>
                </div>
            </div>
        </main> /* .layout-container ends here */
    );
}