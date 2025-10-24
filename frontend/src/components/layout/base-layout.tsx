"use client"

import { JSX, ReactNode } from 'react';
import Navbar from './navbar'


export default function BaseLayout(
        {children, className}:
        {children: ReactNode, className: string}): JSX.Element
    {
    const mainClassName = className ? className :
    "flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10" as string;

    return (
        <div className="flex min-h-screen w-full flex-col">
            <Navbar />
            <main className={mainClassName}>
                {children}
            </main>
        </div>
    )
}
