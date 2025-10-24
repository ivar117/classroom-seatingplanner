"use client"
import { JSX, useEffect, useState } from "react";
import useSWR, { SWRResponse } from "swr"
import {SeatingPlanInterfaceExtended} from "./seatingplan-interfaces";
import styles from "@/app/css/seatingplans.module.css"
import { useAuth } from "@/components/auth-provider";
import fetcher from "@/lib/fetcher";
import Link from "next/link";

export default function Page(): JSX.Element {
    const SEATINGPLANS_GET_URL = "/api/seatingplans"

    const {data, error} = useSWR(SEATINGPLANS_GET_URL, fetcher) as SWRResponse;
    const auth = useAuth();

    useEffect((): void => {
        console.log(error);
        if (error?.status === 401) {
            auth.loginRequiredRedirect();
        }
        console.log(localStorage.getItem("is-logged-in"));
        console.log(auth);
    }, [auth, error])

    const [seatingPlans, SetSeatingPlans] = useState<SeatingPlanInterfaceExtended[]>([]);
    const [headerMessage, SetHeaderMessage] = useState<string>("");

    useEffect((): void => {
        if (data) {
            SetSeatingPlans(data);
            SetHeaderMessage(Object.keys(data).length != 0 ? "Your seating plans" : "You have no seating plans");
        }
    }, [data]);

    return (
      <div className={styles["layout-container"]}>

          <div className={styles["seating-plans-header"]}>{headerMessage}</div>
          <div className={styles["seating-plans-container"]}>
          {Object.keys(seatingPlans).map((key: string, i: number): JSX.Element => {
              const seatingPlanLink = "/seatingplans/" + seatingPlans[i].id as string;
              return (
                  <Link key={i} href={seatingPlanLink} className={styles["seating-plan-box"]}>
                      <div>{seatingPlans[i].name}</div>
                      <div>Students: {seatingPlans[i].people.length}</div>
                  </Link>
              );
          })}
          </div>
      <Link href="/seatingplans/add" className="bg-blue-400 text-white hover:bg-blue-300 px-3 py-2">Add seatingplan</Link>
      </div>
    )
}
