"use client"

import { CircleUser } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "../auth-provider"

import { useRouter } from "next/navigation"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { JSX } from "react"
const LOGOUT_URL = "/api/logout" as string


export default function AccountDropdown(): JSX.Element {
    async function handleLogoutClick(event: React.MouseEvent): Promise<void> {
        event.preventDefault();

        const requestOptions = {
            method: "POST" as string,
            headers: {
                "Content-Type": "application/json" as string
            } as object,
            body: "" as string,
        } as RequestInit;

        const response = await fetch(LOGOUT_URL, requestOptions) as Response;
        console.log(response);
        if (response.ok) {
            console.log("logged out");
            auth.logout();
        }
    }

    const auth = useAuth();
    const router = useRouter() as AppRouterInstance;

    return  <DropdownMenu>
    <DropdownMenuTrigger asChild>
    <Button variant="secondary" size="icon" className="rounded-full">
        <CircleUser className="h-5 w-5" />
        <span className="sr-only">Toggle user menu</span>
    </Button>
    </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
        <DropdownMenuLabel>{auth.username ? auth.username : "Account"}</DropdownMenuLabel>
        <DropdownMenuItem onClick={()=> router.push('/seatingplans')}>Seating plans</DropdownMenuItem>
        <DropdownMenuItem onClick={(e: React.MouseEvent)=> handleLogoutClick(e)}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
}
