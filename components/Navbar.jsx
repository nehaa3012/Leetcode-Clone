import React from 'react'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { ModeToggle } from './mode-toggle'
import { Button } from '@/components/ui/button'
import { PlusCircle, Database, Code2, Trophy, Search } from 'lucide-react'

const Navbar = ({ role }) => {
    const isAdmin = role === 'ADMIN';

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
                {/* Left side: Logo and Navigation */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-105">
                        <div className="bg-primary p-1.5 rounded-lg">
                            <Code2 className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-xl tracking-tight hidden sm:inline-block">
                            Bit<span className="text-primary">Master</span>
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="/problems"
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1.5"
                        >
                            <Database className="h-4 w-4" />
                            Problems
                        </Link>
                        <Link
                            href="/contest"
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1.5"
                        >
                            <Trophy className="h-4 w-4" />
                            Contests
                        </Link>
                    </nav>
                </div>

                {/* Right side: Actions, Theme, and User */}
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center relative max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-9 h-10 w-[200px] lg:w-[300px] rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:bg-background"
                        />
                    </div>

                    {isAdmin && (
                        <Button variant="default" size="sm" className="hidden md:flex items-center gap-2 shadow-sm hover:shadow-md transition-all">
                            <PlusCircle className="h-4 w-4" />
                            Create Problem
                        </Button>
                    )}

                    <div className="flex items-center gap-2 border-l pl-4 ml-2">
                        <ModeToggle />
                        <div className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-colors">
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: "h-8 w-8"
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar