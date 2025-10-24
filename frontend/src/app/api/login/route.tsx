"use server"

import { setRefreshToken, setToken } from '@/lib/auth';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextResponse } from 'next/server';

const DJANGO_API_LOGIN_URL = "http://backend:8000/api/token/pair" as string;

interface TokenPair {
    username: string;
    access:   string;
    refresh:  string;
}

export async function POST(request: Request): Promise<NextResponse> {
    const requestData = await request.json() as Promise<object>;
    const jsonData = JSON.stringify(requestData) as string;
    const requestOptions = {
        method: "POST" as string,
        headers: {
            "Content-Type": "application/json"
        } as HeadersInit,
        body: jsonData as string,
    } as RequestInit;

    const response = await fetch(DJANGO_API_LOGIN_URL, requestOptions) as Response;
    const responseData = await response.json() as TokenPair;

    if (response.ok) {
        const {username, access, refresh} = responseData;
        await setToken(access) as RequestCookies;
        await setRefreshToken(refresh) as RequestCookies;
        return NextResponse.json({"loggedIn": true, "username": username}, {status: 200})
    }
    else {
        return NextResponse.json({"loggedIn": false, ...responseData}, {status: 400})
    }
}
