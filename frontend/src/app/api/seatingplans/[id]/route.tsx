"use server"

import { getToken } from "@/lib/auth"
import { NextResponse } from "next/server"


export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    const id = (await params).id as string;
    const DJANGO_API_SEATINGPLAN_URL = "http://backend:8000/api/seatingplans/" + id as string;
    const authToken = await getToken() as string;

    if (!authToken) {
        return NextResponse.json({}, {status: 401}) as NextResponse<object>;
    }

    const options = {
        method: "GET" as string,
        headers: {
            "Content-Type":  "application/json",
            "Accept":        "application/json",
            "Authorization": `Bearer ${authToken}`
        } as object,
    } as RequestInit;

    const response = await fetch(DJANGO_API_SEATINGPLAN_URL, options) as Response;
    const result = await response.json() as Promise<JSON>;
    const status = response.status as number;

    return NextResponse.json({...result}, {status: status}) as NextResponse<object>;
}
