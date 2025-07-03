'use client'

import Link from "next/link"
import { BookMarked, Settings, Binoculars } from "lucide-react"
import { usePathname } from "next/navigation"

const navLinks = [
    {
        id: "overview",
        label: "Overview",
        href: "/dashboard",
        icon: <Binoculars/>
    },
    {
        id: "dictionaries",
        label: "Dictionaries",
        href: "/dashboard/dictionaries",
        icon: <BookMarked />
    },
    {
        id: "settings",
        label: "Settings",
        href: "/dashboard/settings",
        icon: <Settings/>
    }
] as const

function SideBar() {
    const pathname = usePathname()

    return (
        <nav className="w-64 bg-white shadow-md p-4">
            <div className="space-y-4">
                <h2 className="text-xl font-bold p-2">Navigation</h2>
                <ul className="space-y-1">
                    {navLinks.map(link => (
                        <li key={link.id}>
                            <Link
                                href={link.href}
                                className={`flex items-center p-2 rounded transition-colors ${
                                    pathname === link.href 
                                        ? 'bg-blue-50 text-blue-600' 
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                <span className="mr-2">{link.icon}</span>
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}

export default SideBar