import { RequestCookie, RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies, ResponseCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";

const TOKEN_AGE          = 3600 as number;
const TOKEN_NAME         = "auth-token" as string;
const TOKEN_REFRESH_NAME = "auth-refresh-token" as string;

export async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies() as ReadonlyRequestCookies;
    const myAuthToken = cookieStore.get(TOKEN_NAME) as RequestCookie | undefined;
    return myAuthToken?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
    const cookieStore = await cookies() as ReadonlyRequestCookies;
    const myRefreshToken = cookieStore.get(TOKEN_REFRESH_NAME) as RequestCookie | undefined;
    return myRefreshToken?.value;
}

export async function setToken(authToken: string): Promise<RequestCookies> {
    // login
    const cookieStore = await cookies() as unknown as RequestCookies; // Annoying ReadonlyRequestCookies type workaround type shit
    cookieStore.set({
        name:     TOKEN_NAME as string,
        value:    authToken as string,
        httpOnly: true as boolean, // limit client-side js
        sameSite: 'strict' as string,
        secure:   (process.env.NODE_ENV !== 'development') as boolean,
        maxAge:   TOKEN_AGE as number,
    } as RequestCookie);
    return cookieStore;
}

export async function setRefreshToken(authRefreshToken: string): Promise<RequestCookies> {
    // login
    const cookieStore = await cookies() as unknown as RequestCookies;
    cookieStore.set({
        name:     TOKEN_REFRESH_NAME as string,
        value:    authRefreshToken as string,
        httpOnly: true as boolean,
        sameSite: 'strict' as string,
        secure:   (process.env.NODE_ENV !== 'development') as boolean,
        maxAge:   TOKEN_AGE as number,
    } as RequestCookie);
    return cookieStore;
}

export async function deleteTokens(): Promise<ResponseCookies> {
    // logout
    const cookieStore = await cookies() as ReadonlyRequestCookies;
    cookieStore.delete(TOKEN_REFRESH_NAME);
    return cookieStore.delete(TOKEN_NAME);
}
