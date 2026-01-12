import React from 'react'
import { getLeaderboardData } from '@/app/action/serverActions'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Crown, User as UserIcon, ArrowLeft } from "lucide-react"
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const LeaderboardPage = async () => {
    const leaderboard = await getLeaderboardData();

    // Split into top 3 and others
    const top3 = leaderboard.slice(0, 3);
    const others = leaderboard.slice(3);

    return (
        <div className="container max-w-6xl py-10 px-4 space-y-12 mx-auto">
            {/* Back Button */}
            <div className="flex items-center justify-start">
                <Link href="/">
                    <Button variant="ghost" size="sm" className="gap-2 hover:bg-accent transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>
            </div>

            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Global Leaderboard</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    The absolute elite. These are the top problem solvers on the platform ranked by their consistency and mastery.
                </p>
            </div>

            {/* Podium Section */}
            {top3.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-4xl mx-auto pt-8">
                    {/* Rank 2 */}
                    {top3[1] && <PodiumStep user={top3[1]} rank={2} color="text-slate-400" bgColor="bg-slate-100 dark:bg-slate-900/50" height="h-32" />}

                    {/* Rank 1 */}
                    {top3[0] && <PodiumStep user={top3[0]} rank={1} color="text-yellow-500" bgColor="bg-yellow-100 dark:bg-yellow-900/50" height="h-40" isFirst />}

                    {/* Rank 3 */}
                    {top3[2] && <PodiumStep user={top3[2]} rank={3} color="text-amber-600" bgColor="bg-amber-100 dark:bg-amber-900/50" height="h-24" />}
                </div>
            )}

            {/* Others Table */}
            <Card className="shadow-lg border-primary/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-6 w-6 text-primary" />
                        Rankings
                    </CardTitle>
                    <CardDescription>Top performers in the community</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Rank</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead className="text-right">Problems Solved</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {others.length > 0 ? others.map((user) => (
                                <TableRow key={user.id} className="group hover:bg-muted/50 transition-colors">
                                    <TableCell className="font-bold text-lg text-muted-foreground">
                                        #{user.rank}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border border-primary/10 group-hover:scale-105 transition-transform">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                                                <AvatarFallback><UserIcon /></AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-semibold">{user.name}</span>
                                                <span className="text-xs text-muted-foreground">@{user.username}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-xl font-bold text-primary">
                                        {user.solveCount}
                                    </TableCell>
                                </TableRow>
                            )) : (
                                leaderboard.slice(0, 3).map((user) => (
                                    <TableRow key={user.id} className="group hover:bg-muted/50 transition-colors md:hidden">
                                        <TableCell className="font-bold text-lg text-muted-foreground">
                                            #{user.rank}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                                                    <AvatarFallback><UserIcon /></AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">{user.name}</span>
                                                    <span className="text-xs text-muted-foreground">@{user.username}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-xl font-bold text-primary">
                                            {user.solveCount}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    {leaderboard.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            No legends found yet. Be the first!
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

function PodiumStep({ user, rank, color, bgColor, height, isFirst = false }) {
    return (
        <div className={`flex flex-col items-center gap-4 ${isFirst ? 'order-first md:order-none' : ''}`}>
            <div className="relative group">
                <Avatar className={`h-20 w-20 border-4 ${isFirst ? 'border-yellow-500 ring-4 ring-yellow-500/20' : 'border-slate-300'} shadow-2xl transition-transform group-hover:scale-110`}>
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                    <AvatarFallback><UserIcon /></AvatarFallback>
                </Avatar>
                <div className={`absolute -top-3 -right-3 ${color} drop-shadow-md`}>
                    {rank === 1 ? <Crown className="h-8 w-8 fill-current" /> : <Medal className="h-8 w-8 fill-current" />}
                </div>
            </div>

            <div className="text-center">
                <p className="font-bold text-lg truncate max-w-[150px]">{user.name}</p>
                <p className="text-xs text-muted-foreground">@{user.username}</p>
            </div>

            <div className={`w-full ${height} ${bgColor} rounded-t-3xl border-x border-t flex flex-col items-center justify-center gap-1 shadow-inner`}>
                <span className={`text-4xl font-black ${color}`}>{rank}</span>
                <span className="text-sm font-bold opacity-70 flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    {user.solveCount} SOLVED
                </span>
            </div>
        </div>
    );
}

export default LeaderboardPage
