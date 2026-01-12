'use server';
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/syncUser";
import { revalidatePath } from "next/cache";

// Get all Problems
export async function getAllProblems() {
    try {
        const user = await syncUser();
        const problems = await prisma.problem.findMany({
            where: {
                userId: user.id
            }
        });
        return problems;
    } catch (error) {
        console.error("Error fetching problems:", error);
        throw error;
    }
}

export async function getAllProblemsForListing(difficulty) {
    try {
        const user = await syncUser();

        let where = {};
        if (difficulty && difficulty !== "ALL") {
            where.difficulty = difficulty;
        }

        const problems = await prisma.problem.findMany({
            where,
            include: {
                solvedBy: {
                    where: {
                        userId: user.id
                    },
                    select: {
                        id: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const formattedProblems = problems.map(problem => ({
            ...problem,
            isSolved: problem.solvedBy.length > 0
        }));

        return { problems: formattedProblems, userRole: user.role, currentUserId: user.id };
    } catch (error) {
        console.error("Error fetching problems list:", error);
        throw error;
    }
}

// Get single problem with userId
export async function getProblemById(id) {
    try {
        const user = await syncUser();
        const problem = await prisma.problem.findUnique({
            where: {
                id: id,
                // userId: user.id
            }
        });
        return problem;
    } catch (error) {
        console.error("Error fetching problem:", error);
        throw error;
    }
}

// Delete problem
export async function deleteProblem(id) {
    try {
        const user = await syncUser();
        if (user.role !== "ADMIN") {
            throw new Error("Only Admin can delete problems");
        }
        const problem = await prisma.problem.delete({
            where: {
                id: id
            }
        });
        return problem;
        revalidatePath("/problems");
    } catch (error) {
        console.error("Error deleting problem:", error);
        throw error;
    }
}

// Get user profile
export async function getUserProfile() {
    try {
        const user = await syncUser();
        const profile = await prisma.user.findUnique({
            where: {
                id: user.id
            },
            include: {
                problems: true,
                solvedBy: {
                    include: {
                        problem: true
                    }
                }
            }
        });
        return profile;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}

// Get leaderboard data
export async function getLeaderboardData() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                name: true,
                clerkId: true,
                _count: {
                    select: {
                        solvedBy: true
                    }
                }
            },
            orderBy: {
                solvedBy: {
                    _count: "desc",
                },
            }, 
        });

        // Format for easier use in frontend
        return users.map((user, index) => ({
            rank: index + 1,
            id: user.id,
            username: user.username,
            name: user.name,
            clerkId: user.clerkId,
            solveCount: user._count.solvedBy
        }));
    } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        throw error;
    }
} 

