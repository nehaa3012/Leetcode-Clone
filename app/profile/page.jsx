import React from 'react'
import { getUserProfile } from '@/app/action/serverActions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
    CheckCircle2,
    Code2,
    Trophy,
    Calendar,
    User as UserIcon,
    ArrowRight,
    ArrowLeft
} from "lucide-react"
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const ProfilePage = async () => {
    const profile = await getUserProfile();

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-muted-foreground">User not found.</p>
            </div>
        );
    }

    const stats = {
        total: profile.solvedBy.length,
        easy: profile.solvedBy.filter(s => s.problem.difficulty === 'EASY').length,
        medium: profile.solvedBy.filter(s => s.problem.difficulty === 'MEDIUM').length,
        hard: profile.solvedBy.filter(s => s.problem.difficulty === 'HARD').length,
    };

    return (
        <div className="container max-w-6xl py-10 px-4 space-y-8 mx-auto">
            {/* Back Button */}
            <div className="flex items-center justify-start">
                <Link href="/">
                    <Button variant="ghost" size="sm" className="gap-2 hover:bg-accent transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-card p-8 rounded-2xl border shadow-sm">
                <Avatar className="h-24 w-24 border-2 border-primary/20">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} />
                    <AvatarFallback><UserIcon className="h-12 w-12" /></AvatarFallback>
                </Avatar>
                <div className="space-y-2 text-center md:text-left flex-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <h1 className="text-3xl font-bold tracking-tight">{profile.name}</h1>
                        <Badge variant={profile.role === 'ADMIN' ? 'default' : 'secondary'} className="w-fit mx-auto md:mx-0">
                            {profile.role}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground text-lg">@{profile.username}</p>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground pt-2">
                        <span className="flex items-center gap-1.6">
                            <Calendar className="h-4 w-4" />
                            Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Solved"
                    value={stats.total}
                    icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
                    description="Problems completed"
                />
                <StatCard
                    title="Easy"
                    value={stats.easy}
                    icon={<div className="h-3 w-3 rounded-full bg-green-500" />}
                    description="Level 1 challenges"
                />
                <StatCard
                    title="Medium"
                    value={stats.medium}
                    icon={<div className="h-3 w-3 rounded-full bg-yellow-500" />}
                    description="Level 2 challenges"
                />
                <StatCard
                    title="Hard"
                    value={stats.hard}
                    icon={<div className="h-3 w-3 rounded-full bg-red-500" />}
                    description="Level 3 challenges"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity / Solved Problems */}
                <Card className="lg:col-span-2 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-yellow-500" />
                                Solved Problems
                            </CardTitle>
                            <CardDescription>Your conquest history</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {profile.solvedBy.length > 0 ? (
                            <div className="space-y-4 pt-4">
                                {profile.solvedBy.map((solved) => (
                                    <div key={solved.id} className="group flex items-center justify-between p-4 rounded-xl border bg-card/50 hover:bg-accent/50 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${getDifficultyColor(solved.problem.difficulty)}`}>
                                                <Code2 className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold group-hover:text-primary transition-colors">
                                                    {solved.problem.title}
                                                </h4>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Solved on {new Date(solved.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <Link href={`/problems/${solved.problem.id}`}>
                                            <Badge variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center gap-1">
                                                Review <ArrowRight className="h-3 w-3" />
                                            </Badge>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center space-y-3">
                                <Code2 className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
                                <p className="text-muted-foreground">You haven't solved any problems yet.</p>
                                <Link href="/problems" className="inline-block text-primary hover:underline text-sm font-medium">
                                    Start Solving Now
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Personal Info / Sidebar */}
                <div className="space-y-6">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Account Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground uppercase">Email Address</p>
                                <p className="text-sm border rounded-md p-2 bg-muted/30">{profile.email || "N/A"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground uppercase">Clerk ID</p>
                                <p className="text-sm font-mono text-xs border rounded-md p-2 bg-muted/30 truncate">{profile.clerkId}</p>
                            </div>
                            <Separator />
                            <div className="pt-2">
                                <p className="text-xs text-muted-foreground text-center italic">
                                    Member since {new Date(profile.createdAt).getFullYear()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {profile.role === 'ADMIN' && (
                        <Card className="border-primary/20 bg-primary/5 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Badge variant="default" className="bg-primary hover:bg-primary">Admin</Badge>
                                    Created Content
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Problems Created</span>
                                    <span className="text-2xl font-bold">{profile.problems.length}</span>
                                </div>
                                <Link href="/create-problem">
                                    <button className="w-full mt-4 text-xs bg-primary text-primary-foreground py-2 rounded-md hover:opacity-90 transition-opacity">
                                        Create New Problem
                                    </button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon, description }) {
    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}

function getDifficultyColor(difficulty) {
    switch (difficulty) {
        case 'EASY': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
        case 'HARD': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
        default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
}

export default ProfilePage