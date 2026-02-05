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
import { CheckCircle, XCircle, Trash2, Edit, Plus } from "lucide-react"
import { deleteProblem } from "@/app/action/serverActions"
import { useRouter } from "next/navigation"
import { toast } from "sonner" // Assuming sonner is installed as seen in list_dir 'sonner.jsx'
import { Checkbox } from "@/components/ui/checkbox"
import { CreatePlaylistModal } from "./CreatePlaylistModal"

const ProblemTable = ({ problems, userRole }) => {
    const [filterDifficulty, setFilterDifficulty] = useState("ALL");
    const [selectedProblems, setSelectedProblems] = useState([]);
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
    const router = useRouter();

    const filteredProblems = problems.filter(problem => {
        if (filterDifficulty === "ALL") return true;
        return problem.difficulty === filterDifficulty;
    });

    const toggleSelectAll = () => {
        if (selectedProblems.length === filteredProblems.length) {
            setSelectedProblems([]);
        } else {
            setSelectedProblems(filteredProblems);
        }
    };

    const toggleSelectProblem = (problem) => {
        if (selectedProblems.some(p => p.id === problem.id)) {
            setSelectedProblems(selectedProblems.filter(p => p.id !== problem.id));
        } else {
            setSelectedProblems([...selectedProblems, problem]);
        }
    };

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
                <div>
                    <h2 className="text-xl font-semibold">Problems List</h2>
                    {selectedProblems.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                            {selectedProblems.length} problems selected
                        </p>
                    )}
                </div>
                <div className="flex gap-2 items-center">
                    <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by Difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Difficulties</SelectItem>
                            <SelectItem value="EASY">Easy</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HARD">Hard</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        variant={selectedProblems.length > 0 ? "default" : "outline"}
                        className="gap-2"
                        disabled={selectedProblems.length === 0}
                        onClick={() => setIsPlaylistModalOpen(true)}
                    >
                        <Plus className="h-4 w-4" />
                        Create Playlist
                    </Button>
                </div>
            </div>

            <div className="rounded-md border border-gray-200 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox
                                    checked={selectedProblems.length === filteredProblems.length && filteredProblems.length > 0}
                                    onCheckedChange={toggleSelectAll}
                                />
                            </TableHead>
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
                                <TableCell colSpan={userRole === 'ADMIN' ? 6 : 5} className="h-24 text-center">
                                    No problems found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProblems.map((problem) => (
                                <TableRow key={problem.id} className={selectedProblems.some(p => p.id === problem.id) ? "bg-primary/5" : ""}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedProblems.some(p => p.id === problem.id)}
                                            onCheckedChange={() => toggleSelectProblem(problem)}
                                        />
                                    </TableCell>
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

            <CreatePlaylistModal
                isOpen={isPlaylistModalOpen}
                onClose={() => setIsPlaylistModalOpen(false)}
                selectedProblems={selectedProblems}
                onClearSelection={() => setSelectedProblems([])}
            />
        </div>
    )
}

export default ProblemTable