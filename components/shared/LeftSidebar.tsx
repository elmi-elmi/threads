'use client'

import { sidebarLinks } from "@/constants"
import { SignOutButton, useAuth } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"


function LeftSidebar() {
    const pathname = usePathname()
    const { userId } = useAuth()
    return (
        <section className="custom-scrollbar leftsidebar bg-dark-4">
            <div className="flex w-full flex-1 flex-col gap-6 px-6">
                {
                    sidebarLinks.map((link, index) => {
                        const isActive = pathname.includes(link.route) && link.route.length
                            || pathname === link.route
                        return <Link
                            key={index}
                            href={link.route === '/profile' ? `/profile/${userId}` : link.route}
                            className={`leftsidebar_link ${isActive && 'bg-primary-500'}`}
                        >
                            <Image
                                src={link.imgURL}
                                alt={link.label}
                                width={24}
                                height={24}
                            />
                            <p className='text-light-1 max-g:hidden'>{link.label}</p>
                        </Link>
                    }
                    )
                }

            </div>

            <div className="mt-10 px-6">
                <SignOutButton signOutOptions={{ redirectUrl: '/sign-in' }}>
                    <div className="flex cursor-pointer gap-4 p-4">
                        <Image src={'/assets/logout.svg'} alt="logout" width={24} height={24} />

                        <p className="text-light-2 max-lg:hidden">
                            Logout
                        </p>
                    </div>
                </SignOutButton>
            </div>
        </section >
    )
}

export default LeftSidebar