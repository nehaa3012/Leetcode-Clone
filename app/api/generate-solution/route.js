
import { NextResponse } from "next/server";
import { generateSolution } from "@/lib/gemini";
import { syncUser } from "@/lib/syncUser";

export async function POST(req) {
    try {
        const user = await syncUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, description, testCases, language } = await req.json();

        if (!title || !description) {
            return NextResponse.json({ error: "Missing problem context" }, { status: 400 });
        }

        const solutionData = await generateSolution(title, description, testCases, language || "JAVASCRIPT");

        return NextResponse.json(solutionData);
    } catch (error) {
        console.error("Generate Solution API Error:", error);
        return NextResponse.json(
            { error: "Failed to generate solution" },
            { status: 500 }
        );
    }
}
