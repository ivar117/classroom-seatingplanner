"use client"

import { useAuth } from "@/components/auth-provider";
import { Input } from "@/components/ui/input";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { FormEvent, JSX, useEffect } from "react";

const CSV_UPLOAD_URL = "/api/seatingplans/csv" as string;

export default function Page(): JSX.Element {
    const auth = useAuth();
    const router = useRouter() as AppRouterInstance;

    useEffect(() => {
        if (auth.isAuthenticated != null && !auth.isAuthenticated) {
            auth.loginRequiredRedirect();
        }
    }, [auth])

    async function handleSubmit(event: FormEvent): Promise<void> {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement | undefined) as FormData;

        const requestOptions = {
            method: "POST" as string,
            body: formData as FormData,
        } as RequestInit;

        const response = await fetch(CSV_UPLOAD_URL, requestOptions) as Response;
        const responseData = await response.json() as Promise<object>

        if (response.ok) {
            console.log("seating plan uploaded succesfully");
            router.replace("/seatingplans");
        }
        else {
            console.log("uploading seating plan failed");
            console.log(responseData)
        }
    }

    return (
        <form onSubmit={(e) => {handleSubmit(e)}} className="p-4">
            <Input type="text" name="name" className="mt-4 mb-4" />
            <Input id="seating-plan-csv" required type="file" name="file" />
            <button type='submit' className="bg-blue-400 text-white hover:bg-blue-300 px-3 py-2 mt-4">
                Create new seating plan
            </button>
        </form>
    )
}
