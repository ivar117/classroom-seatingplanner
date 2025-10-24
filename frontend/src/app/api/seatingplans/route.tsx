"use server"

import { getToken } from "@/lib/auth"
import { NextResponse } from "next/server"

const DJANGO_API_SEATINGPLAN_URL = "http://backend:8000/api/seatingplans"

export async function GET(): Promise<NextResponse> {
    const authToken = await getToken() as string;
    if (!authToken) {
        return NextResponse.json({}, {status: 401}) as NextResponse<object>;
    }

    const options = {
        method: "GET" as string,
        headers: {
            "Content-Type":  "application/json" as string,
            "Accept":        "application/json" as string,
            "Authorization": `Bearer ${authToken}` as string
        } as object,
    } as RequestInit;

    const response = await fetch(DJANGO_API_SEATINGPLAN_URL, options) as Response;
    const result = await response.json() as Response;
    const status = response.status as number;

    return NextResponse.json({...result}, {status: status}) as NextResponse;
}
