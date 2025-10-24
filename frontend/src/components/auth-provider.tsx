"use client"

import {
    JSX,
    createContext,
    useContext,
    useState,
    useEffect,
    Context
} from "react";
import {
    ReadonlyURLSearchParams,
    usePathname,
    useRouter,
    useSearchParams
} from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface AuthContextValues {
    isAuthenticated?:      boolean;
    login:                 (username?: string) => void;
    logout:                () => void;
    loginRequiredRedirect: () => void;
    username:              string;
}

const AuthContext = createContext<AuthContextValues>({} as AuthContextValues) as Context<AuthContextValues>;

export const LOGIN_REDIRECT_URL  = "/seatingplans" as string;
export const LOGOUT_REDIRECT_URL = "/login"        as string;
const LOGIN_REQUIRED_URL         = "/login"        as string;
const LOCAL_STORAGE_KEY          = "is-logged-in"  as string;
const LOCAL_USERNAME_KEY         = "username"      as string;

export function AuthProvider({children}: {children: JSX.Element}): JSX.Element {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>();
    const [username, setUsername] = useState<string>("");
    const router = useRouter() as AppRouterInstance;
    const pathname = usePathname() as string;
    const searchParams = useSearchParams() as ReadonlyURLSearchParams;

    useEffect((): void => {
        const storedAuthStatus = localStorage.getItem(LOCAL_STORAGE_KEY) as string;
        if (storedAuthStatus) {
            const storedAuthStatusInt = parseInt(storedAuthStatus) as number;
            setIsAuthenticated(storedAuthStatusInt===1)
        }
        const storedUsername = localStorage.getItem(LOCAL_USERNAME_KEY)
        if (storedUsername) {
            setUsername(storedUsername)
        }
    }, [])

    const login = (username?: string): void => {
        setIsAuthenticated(true)
        localStorage.setItem(LOCAL_STORAGE_KEY, "1");

        if (username) {
            localStorage.setItem(LOCAL_USERNAME_KEY, `${username}`)
            setUsername(username)
        } else {
            localStorage.removeItem(LOCAL_USERNAME_KEY)
        }

        const nextUrl = searchParams.get("next") as string | null;
        const invalidNextUrl = ["/login", "/logout"] as Array<string>;
        const nextUrlValid = nextUrl && nextUrl.startsWith("/") && !invalidNextUrl.includes(nextUrl) as boolean;

        if (nextUrlValid) {
            router.replace(nextUrl)
        }
        else {
            router.replace(LOGIN_REDIRECT_URL);
        }
    }

    const logout = (): void => {
        setIsAuthenticated(false)
        localStorage.setItem(LOCAL_STORAGE_KEY, "0");
        router.replace(LOGOUT_REDIRECT_URL);
    }

    const loginRequiredRedirect = (): void => {
        // user is not autenticated
        setIsAuthenticated(false)
        localStorage.setItem(LOCAL_STORAGE_KEY, "0");
        let loginWithNextUrl = `${LOGIN_REQUIRED_URL}?next=${pathname}` as string;
        if (LOGIN_REQUIRED_URL === pathname) {
            loginWithNextUrl = `${LOGIN_REQUIRED_URL}`;
        }
        router.replace(loginWithNextUrl);
    }

    return <AuthContext.Provider value={{
        isAuthenticated,
        login,
        logout,
        loginRequiredRedirect,
        username
    }}>
        {children}
    </AuthContext.Provider>
}

export function useAuth() {
    return useContext(AuthContext);
}
