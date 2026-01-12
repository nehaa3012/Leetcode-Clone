'use client'
import React from 'react'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { ModeToggle } from './mode-toggle'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, Database, Code2, Trophy, Search, Loader2, User } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

const Navbar = ({ role }) => {
    const isAdmin = role === 'ADMIN';
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        // Close search results when clicking outside
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchResults([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.trim() === '') {
                setSearchResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`/api/query?query=${encodeURIComponent(searchQuery.trim())}`);
                const data = await response.json();
                setSearchResults(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error searching:', error);
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

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
                            href="/leaderboard"
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1.5"
                        >
                            <Trophy className="h-4 w-4" />
                            Leaderboard
                        </Link>
                    </nav>
                </div>

                {/* Right side: Actions, Theme, and User */}
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center relative max-w-sm" ref={searchRef}>
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => {
                                // Optional: trigger search if query exists
                            }}
                            type="text"
                            placeholder="Search problems..."
                            className="pl-9 h-10 w-[200px] lg:w-[300px] rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:bg-background"
                        />
                        {isLoading && (
                            <div className="absolute right-3 top-2.5">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                        )}

                        {/* Search Results Dropdown */}
                        {searchResults.length > 0 && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-popover text-popover-foreground rounded-md border shadow-md animate-in fade-in-0 zoom-in-95 z-50 overflow-hidden">
                                <div className="p-1">
                                    <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                        Problems
                                    </p>
                                    {searchResults.slice(0, 5).map((problem) => (
                                        <Link
                                            key={problem.id}
                                            href={`/problems/${problem.id}`}
                                            onClick={() => {
                                                setSearchResults([]);
                                                setSearchQuery('');
                                            }}
                                            className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                        >
                                            <div className="flex flex-col flex-1 gap-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium">{problem.title}</span>
                                                    {problem.difficulty && (
                                                        <Badge variant="secondary" className="text-[10px] h-5">
                                                            {problem.difficulty}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {isAdmin ? (
                        <Link href="/create-problem"><Button variant="default" size="sm" className="hidden md:flex items-center gap-2 shadow-sm hover:shadow-md transition-all">
                            <PlusCircle className="h-4 w-4" />
                            Create Problem
                        </Button></Link>
                    ) : <Link href="/profile"><Button variant="default" size="sm" className="hidden md:flex items-center gap-2 shadow-sm hover:shadow-md transition-all">
                        <User className="h-4 w-4" />
                        Profile
                    </Button></Link>}

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