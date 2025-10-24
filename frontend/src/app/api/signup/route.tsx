"use server"

import { NextResponse } from 'next/server';

const DJANGO_API_SIGNUP_URL = "http://backend:8000/api/user" as string;

export async function POST(request: Request): Promise<NextResponse> {
    const requestData = await request.json() as Promise<JSON>;
    const jsonData = JSON.stringify(requestData) as string;
    const requestOptions = {
        method: "POST" as string,
        headers: {
            "Content-Type": "application/json"
        } as HeadersInit,
        body: jsonData as string,
    } as RequestInit;

    const response = await fetch(DJANGO_API_SIGNUP_URL, requestOptions) as Response;
    if (response.ok) {
        console.log("user created succesfully");
        return NextResponse.json({"status": "signed up"}, {status: 200})
    }
    else {
        return NextResponse.json({"status": "error signing up"}, {status: 401});
    }
}
