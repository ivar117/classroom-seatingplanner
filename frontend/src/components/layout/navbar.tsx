"use client"

import Link from "next/link"
import { useAuth } from "../auth-provider"
import NavLinks, {NonUserLinks, NavLink} from './nav-links'
import MobileNavbar from "./mobile-navbar"
import AccountDropdown from "./account-dropdown"
import { JSX } from "react"


export default function Navbar({className}: {className?: string}) {
    const auth = useAuth();
    const finalClass = className ? className : "z-40 sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6" as string;
    return  <header className={finalClass}>
    <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        {NavLinks.map((navLinkItem: NavLink, idx: number): JSX.Element | null => {
            const shouldHide = !auth.isAuthenticated &&navLinkItem.authRequired as boolean;

            return shouldHide ? null : <Link
                href={navLinkItem.href}
                key={`nav-links-a-${idx}`}
                className="text-muted-foreground transition-colors hover:text-foreground"
            >
                {navLinkItem.label}
            </Link>
        })}
    </nav>
    <MobileNavbar />
    <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
      {auth.isAuthenticated ?
      <div className="ml-auto">
        <AccountDropdown />
        </div>
    : <div className="ml-auto space-x-2">
        {NonUserLinks.map((navLinkItem: NavLink, idx: number): JSX.Element | null => {
            const shouldHide = !auth.isAuthenticated &&navLinkItem.authRequired as boolean;

            return shouldHide ? null : <Link
                href={navLinkItem.href}
                key={`nav-links-d-${idx}`}
                className="text-muted-foreground transition-colors hover:text-foreground"
            >
                {navLinkItem.label}
            </Link>
        })}
        </div>}
    </div>
  </header>
}
