'use client';
import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, Trash2, Edit } from "lucide-react"
import { deleteProblem } from "@/app/action/serverActions"
import { useRouter } from "next/navigation"
import { toast } from "sonner" // Assuming sonner is installed as seen in list_dir 'sonner.jsx'

const ProblemTable = ({ problems, userRole }) => {
    const [filterDifficulty, setFilterDifficulty] = useState("ALL");
    const router = useRouter();

    const filteredProblems = problems.filter(problem => {
        if (filterDifficulty === "ALL") return true;
        return problem.difficulty === filterDifficulty;
    });

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this problem?")) {
            try {
                await deleteProblem(id);
                toast.success("Problem deleted successfully");
                router.refresh();
            } catch (error) {
                toast.error("Failed to delete problem");
                console.error(error);
            }
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'EASY': return 'bg-green-500 hover:bg-green-600';
            case 'MEDIUM': return 'bg-yellow-500 hover:bg-yellow-600';
            case 'HARD': return 'bg-red-500 hover:bg-red-600';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Problems List</h2>
                <div className="w-[180px]">
                    <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by Difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Difficulties</SelectItem>
                            <SelectItem value="EASY">Easy</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HARD">Hard</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border border-gray-200">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Status</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Difficulty</TableHead>
                            <TableHead>Acceptance</TableHead>
                            {userRole === 'ADMIN' && <TableHead className="text-right">Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProblems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={userRole === 'ADMIN' ? 5 : 4} className="h-24 text-center">
                                    No problems found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProblems.map((problem) => (
                                <TableRow key={problem.id}>
                                    <TableCell>
                                        {problem.isSolved ? (
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium hover:underline cursor-pointer" onClick={() => router.push(`/problems/${problem.id}`)}>
                                        {problem.title}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`${getDifficultyColor(problem.difficulty)} text-white border-none`}>
                                            {problem.difficulty}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {/* Placeholder for acceptance rate if available, or just random/static for now if not in schema */}
                                        N/A
                                    </TableCell>
                                    {userRole === 'ADMIN' && (
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => router.push(`/problems/edit/${problem.id}`)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(problem.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default ProblemTable