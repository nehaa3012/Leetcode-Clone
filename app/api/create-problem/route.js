import { NextResponse } from "next/server";
import { syncUser } from "@/lib/syncUser";
import { getJudge0LanguageId, submitBatch, pollBatchResults } from "@/lib/judge0";
import { prisma } from "@/lib/prisma";
import { generateWrapper } from "@/lib/codeWrapper";

/* =========================
   API ROUTE
========================= */

export async function POST(req) {
    try {
        const user = await syncUser();
        if (user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            title,
            description,
            difficulty,
            tags,
            examples,
            constraints,
            hints,
            editorial,
            testCases,
            codeSnippets,
            referenceSolutions,

            // 🔥 RUNTIME ONLY (NOT IN PRISMA)
            problemType, // "NUMBER" | "STRING"
        } = body;

        // SANITIZE TEST CASES: Remove all whitespaces from expected outputs
        const sanitizedTestCases = (testCases || []).map(tc => ({
            ...tc,
            output: (tc.output || "").replace(/\s+/g, ""),
            input: (tc.input || "").trim()
        }));

        // SANITIZE EXAMPLES: Remove whitespaces from outputs for visual consistency
        const sanitizedExamples = { ...(examples || {}) };
        Object.keys(sanitizedExamples).forEach(lang => {
            if (sanitizedExamples[lang].output) {
                sanitizedExamples[lang].output = sanitizedExamples[lang].output.replace(/\s+/g, "");
            }
        });


        /* ---------- BASIC VALIDATION ---------- */

        if (
            !title ||
            !description ||
            !difficulty ||
            !tags ||
            !sanitizedExamples ||
            !constraints ||
            !sanitizedTestCases.length ||
            !codeSnippets ||
            !referenceSolutions
        ) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (!problemType) {
            return NextResponse.json(
                { error: "problemType is required for Judge0 validation" },
                { status: 400 }
            );
        }

        /* =========================
           JUDGE0 VALIDATION
        ========================= */

        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
            if (!solutionCode?.trim()) continue;

            let normalizedLang = language.toUpperCase();
            if (normalizedLang === "CPP") normalizedLang = "C++";

            const languageId = getJudge0LanguageId(normalizedLang);
            if (!languageId) {
                return NextResponse.json(
                    { error: `Unsupported language: ${language}` },
                    { status: 400 }
                );
            }

            let finalCode = generateWrapper(normalizedLang, solutionCode, problemType);

            const submissions = sanitizedTestCases.map(tc => ({
                source_code: finalCode,
                language_id: languageId,
                stdin: tc.input,
                expected_output: tc.output,
            }));

            const submitRes = await submitBatch(submissions);
            const tokens = submitRes.map(r => r.token);

            const results = await pollBatchResults(tokens);

            for (let i = 0; i < results.length; i++) {
                // Normalize outputs by removing all whitespace for comparison
                const actual = (results[i].stdout || "").replace(/\s+/g, "");
                const expected = submissions[i].expected_output.replace(/\s+/g, "");

                if (actual !== expected) {
                    return NextResponse.json(
                        {
                            error: `Validation failed for ${language}`,
                            input: submissions[i].stdin,
                            expected: sanitizedTestCases[i].output,
                            actual: (results[i].stdout || "").trim(),
                            details: results[i],
                        },
                        { status: 400 }
                    );
                }
            }
        }

        /* =========================
           SAVE PROBLEM (PRISMA)
           ✔ EXACTLY MATCHES YOUR SCHEMA
        ========================= */

        const problem = await prisma.problem.create({
            data: {
                title,
                description,
                difficulty,
                tags,
                examples: sanitizedExamples,
                constraints,
                hints,
                editorial,
                testCases: sanitizedTestCases,
                codeSnippets,
                referenceSolutions,
                userId: user.id,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Problem created successfully",
                data: problem,
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("CREATE PROBLEM ERROR:", err);
        return NextResponse.json(
            {
                error: "Failed to create problem",
                details: err.message,
            },
            { status: 500 }
        );
    }
}
