"use client"

import {
    JSX,
    useState,
    useRef,
    RefObject,
    Suspense
} from "react";
import styles from "./style.module.css";
import "./variables.css"
import GenerateSeatingPlan from "./generate-seatingplan"
import {ExportSeatingPlanAsCsv} from "./seatingplan-converter";


function ToggleSeatOutlinesVisibility(seatingGridRef: RefObject<HTMLElement | null>): void {
    const seatingGridRows = seatingGridRef.current?.children as HTMLCollectionOf<HTMLElement>;

    for (const seatRow of seatingGridRows as HTMLCollectionOf<HTMLElement>) {
        for (const seat of seatRow.children as HTMLCollectionOf<HTMLElement>) {
            if (seat.id == "seat-outline") {
                const seatComputedStyle = window.getComputedStyle(seat) as CSSStyleDeclaration;

                if (seatComputedStyle.getPropertyValue("visibility") == "visible")
                    seat.style.visibility = "hidden";
                else
                    seat.style.visibility = "visible";
            }
        }
    }
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

    const seatingGridRef = useRef<HTMLDivElement | null>(null);

    const toggleSeatOutlinesVisibility = (): void => {
        ToggleSeatOutlinesVisibility(seatingGridRef);
    }

    const exportToCsv = (): void => {
        ExportSeatingPlanAsCsv(seatingGridRef);
    }

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

                        <button
                            onClick={toggleSeatOutlinesVisibility}
                            id={styles["seat-outlines-toggle-button"]}
                            className={styles["sidebar-button"]}
                        >
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
                                <button className={`${styles["dropdown-item"]} ${styles.first}`}>
                                    <img src="/images/components/file-pdf.svg" alt=".pdf icon" /> .pdf file
                                </button>
                                <button className={styles["dropdown-item"]}>
                                    <img src="/images/components/file-png.svg" alt=".png icon" /> .png file
                                </button>
                                <button onClick={exportToCsv} className={`${styles["dropdown-item"]} ${styles.last}`}>
                                    <img src="/images/components/file-csv.svg" alt=".csv icon" /> .csv file
                                </button>
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
                    <div ref={seatingGridRef} className={styles["seating-grid"]}>
                        <Suspense>
                            <GenerateSeatingPlan />
                        </Suspense>
                    </div>
                </div>
            </div>
        </main> /* .layout-container ends here */
    );
}
