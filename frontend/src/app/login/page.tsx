"use client"

import { FormEvent, JSX, useEffect } from "react";

const LOGIN_URL = "/api/login" as string
import styles from "@/app/css/login.module.css";
import { useAuth, LOGIN_REDIRECT_URL } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface LoginInteface {
    username: string;
    password: string;
}

export default function Page(): JSX.Element {
    const auth = useAuth();
    const router = useRouter() as AppRouterInstance;

    useEffect((): void => {
        if (auth.isAuthenticated) {
            router.replace(LOGIN_REDIRECT_URL)
        }
    }, [auth, router])

    async function handleSubmit(event: FormEvent): Promise<void> {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement | undefined) as FormData;
        const objectFromForm = Object.fromEntries(formData) as object;
        const jsonData = JSON.stringify(objectFromForm) as string;
        const requestOptions = {
            method: "POST" as string,
            headers: {
                "Content-Type": "application/json" as string
            } as HeadersInit,
            body: jsonData as string,
        } as RequestInit;

        const response = await fetch(LOGIN_URL, requestOptions) as Response;
        const responseData = await response.json() as LoginInteface

        if (response.ok) {
            // auth.login();
            auth.login(responseData.username)
            console.log("logged in");
        }
        else {
            console.log(await response.json())
        }
    }

    return (
        <div className={styles["layout-container"]}>
            <div className={styles["login-container"]}>
                <div className={styles["login-header"]}>
                    Sign in
                </div>
                <form onSubmit={(e) => {handleSubmit(e)}}>
                    <div className={styles["input-header"]}>Username</div>
                    <input type='text' required name='username'/>
                    <div className={styles["input-header"]}>Password</div>
                    <input type='password' required name='password'/>
                    <button type='submit' className={styles["login-submit"]}>
                        Sign in
                    </button>
                </form>
                <div className={styles.signup}>
                    Don&apos;t have an account yet? <a href="/signup">Sign up now</a>
                </div>
            </div>
        </div>
    );
}
