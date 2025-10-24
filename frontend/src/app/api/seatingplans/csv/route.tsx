"use server"

import { SeatingPlanInterface } from '@/app/seatingplans/seatingplan-interfaces';
import { getToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

const DJANGO_API_UPLOAD_CSV_URL = "http://backend:8000/api/seatingplans/csv" as string;

export async function POST(request: Request): Promise<NextResponse> {
    const requestData = await request.formData() as FormData;
    const authToken = await getToken() as string | undefined;

    const requestOptions = {
        method: "POST" as string,
        headers: {
            "Authorization": "Bearer " + authToken
        } as HeadersInit,
        body: requestData as FormData,
    } as RequestInit;

    const response = await fetch(DJANGO_API_UPLOAD_CSV_URL, requestOptions) as Response;
    const responseData = await response.json() as Promise<SeatingPlanInterface> | Promise<object>;
    console.log(responseData)

    if (response.ok) {
        return NextResponse.json({"seatingPlanUploaded": true}, {status: 200})
    }
    else {
        return NextResponse.json({"seatingPlanUploaded": false, ...responseData}, {status: 400})
    }
}
