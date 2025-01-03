import { ReactNode } from "react"
import { Inter } from 'next/font/google'
import "../globals.css";
import {
    ClerkProvider,
    //  SignedIn, SignedOut, SignInButton, UserButton
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Auth",
    description: "Generated by create next app",
};

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
    children
}: {
    children: ReactNode
}) {
    return <ClerkProvider
        appearance={{
            baseTheme: dark,
        }}
    >
        <html lang="en">
            <body className={`${inter.className} bg-dark-1 w-full flex justify-center items-center min-h-screen`}>
                {/* <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn> */}
                {children}
            </body>
        </html>
    </ClerkProvider>

}