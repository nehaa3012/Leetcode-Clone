"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    Plus,
    Trash2,
    Code2,
    FileText,
    Lightbulb,
    BookOpen,
    CheckCircle2,
    Download,
    Sparkles, // Import Sparkles icon
} from "lucide-react";
import { Editor } from "@monaco-editor/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"; // Ensure these are typically available or use a simple modal


/* ---------------- SCHEMA ---------------- */

const problemSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    problemType: z.enum(["NUMBER", "STRING"]), // 🔥 REQUIRED
    tags: z.array(z.string()),
    constraints: z.string(),
    hints: z.string().optional(),
    editorial: z.string().optional(),
    testCases: z.array(
        z.object({
            input: z.string(),
            output: z.string(),
        })
    ),
    examples: z.any(),
    codeSnippets: z.any(),
    referenceSolutions: z.any(),
});


/* ---------------- HELPER COMPONENTS ---------------- */

const CodeEditor = ({ value, onChange, language = "javascript" }) => {
    // Map language names to Monaco Editor language IDs
    const languageMap = {
        javascript: "javascript",
        python: "python",
        java: "java",
    };

    return (
        <div className="border rounded-md bg-slate-950 text-slate-50">
            <div className="px-4 py-2 bg-slate-800 border-b text-sm font-mono">
                {language}
            </div>
            <div className="h-[300px] w-full">
                <Editor
                    height="300px"
                    defaultLanguage={languageMap[language]}
                    theme="vs-dark"
                    value={value}
                    onChange={onChange}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "on",
                        readOnly: false,
                        wordWrap: "on",
                        formatOnPaste: true,
                        formatOnType: true,
                        automaticLayout: true,
                    }}
                />
            </div>
        </div>
    );
};

/* ---------------- COMPONENT ---------------- */
function CreateProblemForm() {
    const router = useRouter();
    const [sampleType, setSampleType] = useState("DP");
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationTopic, setGenerationTopic] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm({
        resolver: zodResolver(problemSchema),
        defaultValues: {
            title: "",
            description: "",
            difficulty: "EASY",
            problemType: "NUMBER", // ✅ DEFAULT
            tags: [],
            constraints: "",
            hints: "",
            editorial: "",
            testCases: [{ input: "", output: "" }],
            examples: {},
            codeSnippets: {},
            referenceSolutions: {},
        },
    });

    const { control, register, handleSubmit, reset, formState: { errors } } = form;

    const { fields: testCaseFields, append: appendTestCase, remove: removeTestCase } = useFieldArray({
        control,
        name: "testCases",
    });

    const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
        control,
        name: "tags",
    });

    /* ---------------- SUBMIT ---------------- */

    const onSubmit = async (values) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/create-problem", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);
            toast.success("Problem created successfully");
            router.push("/problems");
        } catch (err) {
            toast.error(err.message || "Failed");
        } finally {
            setIsLoading(false);
        }
    };

    /* ---------------- LOAD SAMPLE ---------------- */

    const loadSampleData = () => {
        if (sampleType === "DP") {
            reset({
                title: "Climbing Stairs",
                description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
                difficulty: "EASY",
                problemType: "NUMBER",
                tags: ["dp", "math", "memoization"],
                constraints: "1 <= n <= 45",
                hints: "To reach step n, you could have come from n-1 or n-2.",
                editorial: "This is a classic Fibonacci sequence problem. dp[i] = dp[i-1] + dp[i-2].",
                testCases: [
                    { input: "2", output: "2" },
                    { input: "3", output: "3" },
                ],
                codeSnippets: {
                    JAVASCRIPT: "/**\n * @param {number} n\n * @return {number}\n */\nvar climbStairs = function(n) {\n    // Write your code here\n};",
                    PYTHON: "class Solution:\n    def climbStairs(self, n: int) -> int:\n        # Write your code here\n        pass",
                    JAVA: "class Solution {\n    public int climbStairs(int n) {\n        // Write your code here\n        return 0;\n    }\n}"
                },
                referenceSolutions: {
                    JAVASCRIPT: "/**\n * @param {number} n\n * @return {number}\n */\nvar climbStairs = function(n) {\n    if (n <= 2) return n;\n    let dp = [0, 1, 2];\n    for (let i = 3; i <= n; i++) {\n        dp[i] = dp[i - 1] + dp[i - 2];\n    }\n    return dp[n];\n};",
                    PYTHON: "class Solution:\n    def climbStairs(self, n: int) -> int:\n        if n <= 2: return n\n        a, b = 1, 2\n        for _ in range(3, n + 1):\n            a, b = b, a + b\n        return b",
                    JAVA: "class Solution {\n    public int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int temp = a + b;\n            a = b;\n            b = temp;\n        }\n        return b;\n    }\n}"
                },
                examples: {
                    JAVASCRIPT: {
                        input: "n = 2",
                        output: "2",
                        explanation: "1. 1 step + 1 step\n2. 2 steps"
                    },
                    PYTHON: {
                        input: "n = 2",
                        output: "2",
                        explanation: "1. 1 step + 1 step\n2. 2 steps"
                    },
                    JAVA: {
                        input: "n = 2",
                        output: "2",
                        explanation: "1. 1 step + 1 step\n2. 2 steps"
                    }
                }
            });
        } else {
            reset({
                title: "Valid Palindrome",
                description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
                difficulty: "EASY",
                problemType: "STRING",
                tags: ["string", "two-pointers"],
                constraints: "1 <= s.length <= 2 * 10^5",
                hints: "Use two pointers, one at the start and one at the end.",
                editorial: "Filter the string to keep only alphanumeric chars, then check if it equals its reverse.",
                testCases: [
                    {
                        input: "A man, a plan, a canal: Panama",
                        output: "true",
                    },
                    {
                        input: "race a car",
                        output: "false",
                    },
                ],
                codeSnippets: {
                    JAVASCRIPT: "/**\n * @param {string} s\n * @return {boolean}\n */\nvar isPalindrome = function(s) {\n    // Write your code here\n};",
                    PYTHON: "class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        # Write your code here\n        pass",
                    JAVA: "class Solution {\n    public boolean isPalindrome(String s) {\n        // Write your code here\n        return false;\n    }\n}"
                },
                referenceSolutions: {
                    JAVASCRIPT: "var isPalindrome = function(s) {\n    s = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();\n    let l = 0, r = s.length - 1;\n    while (l < r) {\n        if (s[l] !== s[r]) return false;\n        l++;\n        r--;\n    }\n    return true;\n};",
                    PYTHON: "class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        s = ''.join(filter(str.isalnum, s)).lower()\n        return s == s[::-1]",
                    JAVA: "class Solution {\n    public boolean isPalindrome(String s) {\n        s = s.replaceAll(\"[^a-zA-Z0-9]\", \"\").toLowerCase();\n        int l = 0, r = s.length() - 1;\n        while (l < r) {\n            if (s.charAt(l) != s.charAt(r)) return false;\n            l++;\n            r--;\n        }\n        return true;\n    }\n}"
                },
                examples: {
                    JAVASCRIPT: {
                        input: "s = \"A man, a plan, a canal: Panama\"",
                        output: "true",
                        explanation: "\"amanaplanacanalpanama\" is a palindrome."
                    },
                    PYTHON: {
                        input: "s = \"A man, a plan, a canal: Panama\"",
                        output: "true",
                        explanation: "\"amanaplanacanalpanama\" is a palindrome."
                    },
                    JAVA: {
                        input: "s = \"A man, a plan, a canal: Panama\"",
                        output: "true",
                        explanation: "\"amanaplanacanalpanama\" is a palindrome."
                    }
                }
            });
        }
    };


    /* ---------------- AI GENERATE ---------------- */
    const handleGenerateAI = async () => {
        if (!generationTopic) {
            toast.error("Please enter a topic");
            return;
        }
        setIsGenerating(true);
        try {
            const res = await fetch("/api/generate-problem", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic: generationTopic }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            // Populate form
            reset(data);
            toast.success("Problem generated successfully!");
            setIsDialogOpen(false);
        } catch (err) {
            toast.error("Generation failed: " + err.message);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <Card className="shadow-xl">
                <CardHeader className="pb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <CardTitle className="text-3xl flex items-center gap-3">
                            <FileText className="w-8 h-8 text-amber-600" />
                            Create Problem
                        </CardTitle>

                        <div className="flex flex-col md:flex-row gap-3">
                            {/* AI Generation Dialog */}
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="gap-2 border-amber-500 text-amber-600 hover:bg-amber-50">
                                        <Sparkles className="w-4 h-4" />
                                        Generate with AI
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Generate Problem with AI</DialogTitle>
                                        <DialogDescription>
                                            Enter a topic (e.g., "Binary Search", "Linked List", "Dynamic Programming") and Gemini will generate a complete problem for you.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                        <Label htmlFor="topic" className="text-right">
                                            Topic
                                        </Label>
                                        <Input
                                            id="topic"
                                            value={generationTopic}
                                            onChange={(e) => setGenerationTopic(e.target.value)}
                                            placeholder="e.g. 0/1 Knapsack Problem"
                                            className="col-span-3 mt-2"
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            onClick={handleGenerateAI}
                                            disabled={isGenerating}
                                            className="bg-amber-600 hover:bg-amber-700 text-white"
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-4 h-4 mr-2" />
                                                    Generate
                                                </>
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <div className="flex border rounded-md">
                                <Button
                                    type="button"
                                    variant={sampleType === "DP" ? "default" : "outline"}
                                    size="sm"
                                    className="rounded-r-none"
                                    onClick={() => setSampleType("DP")}
                                >
                                    DP Problem
                                </Button>
                                <Button
                                    type="button"
                                    variant={sampleType === "string" ? "default" : "outline"}
                                    size="sm"
                                    className="rounded-l-none"
                                    onClick={() => setSampleType("string")}
                                >
                                    String Problem
                                </Button>
                            </div>
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={loadSampleData}
                                className="gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Load Sample
                            </Button>
                        </div>
                    </div>
                    <Separator />
                </CardHeader>

                <CardContent className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <Label htmlFor="title" className="text-lg font-semibold">
                                    Title
                                </Label>
                                <Input
                                    id="title"
                                    {...register("title")}
                                    placeholder="Enter problem title"
                                    className="mt-2 text-lg"
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <Label htmlFor="description" className="text-lg font-semibold">
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    {...register("description")}
                                    placeholder="Enter problem description"
                                    className="mt-2 min-h-32 text-base resize-y"
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="difficulty" className="text-lg font-semibold">
                                    Difficulty
                                </Label>
                                <Controller
                                    name="difficulty"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="mt-2">
                                                <SelectValue placeholder="Select difficulty" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="EASY">
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-green-100 text-green-800"
                                                    >
                                                        Easy
                                                    </Badge>
                                                </SelectItem>
                                                <SelectItem value="MEDIUM">
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-amber-100 text-amber-800"
                                                    >
                                                        Medium
                                                    </Badge>
                                                </SelectItem>
                                                <SelectItem value="HARD">
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-red-100 text-red-800"
                                                    >
                                                        Hard
                                                    </Badge>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.difficulty && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.difficulty.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Tags */}
                        <Card className="bg-amber-50 dark:bg-amber-950/20">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-amber-600" />
                                        Tags
                                    </CardTitle>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => appendTag("")}
                                        className="gap-2"
                                    >
                                        <Plus className="w-4 h-4" /> Add Tag
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {tagFields.map((field, index) => (
                                        <div key={field.id} className="flex gap-2 items-center">
                                            <Input
                                                {...register(`tags.${index}`)}
                                                placeholder="Enter tag"
                                                className="flex-1"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeTag(index)}
                                                disabled={tagFields.length === 1}
                                                className="p-2"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                {errors.tags && (
                                    <p className="text-sm text-red-500 mt-2">
                                        {errors.tags.message}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Test Cases */}
                        <Card className="bg-green-50 dark:bg-green-950/20">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        Test Cases
                                    </CardTitle>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => appendTestCase({ input: "", output: "" })}
                                        className="gap-2"
                                    >
                                        <Plus className="w-4 h-4" /> Add Test Case
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {testCaseFields.map((field, index) => (
                                    <Card key={field.id} className="bg-background">
                                        <CardHeader className="pb-4">
                                            <div className="flex justify-between items-center">
                                                <CardTitle className="text-lg">
                                                    Test Case #{index + 1}
                                                </CardTitle>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeTestCase(index)}
                                                    disabled={testCaseFields.length === 1}
                                                    className="text-red-500 gap-2"
                                                >
                                                    <Trash2 className="w-4 h-4" /> Remove
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <Label className="font-medium">Input</Label>
                                                    <Textarea
                                                        {...register(`testCases.${index}.input`)}
                                                        placeholder="Enter test case input"
                                                        className="mt-2 min-h-24 resize-y font-mono"
                                                    />
                                                    {errors.testCases?.[index]?.input && (
                                                        <p className="text-sm text-red-500 mt-1">
                                                            {errors.testCases[index].input.message}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <Label className="font-medium">Expected Output</Label>
                                                    <Textarea
                                                        {...register(`testCases.${index}.output`)}
                                                        placeholder="Enter expected output"
                                                        className="mt-2 min-h-24 resize-y font-mono"
                                                    />
                                                    {errors.testCases?.[index]?.output && (
                                                        <p className="text-sm text-red-500 mt-1">
                                                            {errors.testCases[index].output.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                {errors.testCases && !Array.isArray(errors.testCases) && (
                                    <p className="text-sm text-red-500">
                                        {errors.testCases.message}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Code Editor Sections */}
                        {["JAVASCRIPT", "PYTHON", "JAVA"].map((language) => (
                            <Card key={language} className="bg-slate-50 dark:bg-slate-950/20">
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Code2 className="w-5 h-5 text-slate-600" />
                                        {language}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Starter Code */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">
                                                Starter Code Template
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <Controller
                                                name={`codeSnippets.${language}`}
                                                control={control}
                                                render={({ field }) => (
                                                    <CodeEditor
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        language={language.toLowerCase()}
                                                    />
                                                )}
                                            />
                                            {errors.codeSnippets?.[language] && (
                                                <p className="text-sm text-red-500 mt-2">
                                                    {errors.codeSnippets[language].message}
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Reference Solution */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                Reference Solution
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <Controller
                                                name={`referenceSolutions.${language}`}
                                                control={control}
                                                render={({ field }) => (
                                                    <CodeEditor
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        language={language.toLowerCase()}
                                                    />
                                                )}
                                            />
                                            {errors.referenceSolutions?.[language] && (
                                                <p className="text-sm text-red-500 mt-2">
                                                    {errors.referenceSolutions[language].message}
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Examples */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Example</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <Label className="font-medium">Input</Label>
                                                    <Textarea
                                                        {...register(`examples.${language}.input`)}
                                                        placeholder="Example input"
                                                        className="mt-2 min-h-20 resize-y font-mono"
                                                    />
                                                    {errors.examples?.[language]?.input && (
                                                        <p className="text-sm text-red-500 mt-1">
                                                            {errors.examples[language].input.message}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <Label className="font-medium">Output</Label>
                                                    <Textarea
                                                        {...register(`examples.${language}.output`)}
                                                        placeholder="Example output"
                                                        className="mt-2 min-h-20 resize-y font-mono"
                                                    />
                                                    {errors.examples?.[language]?.output && (
                                                        <p className="text-sm text-red-500 mt-1">
                                                            {errors.examples[language].output.message}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="md:col-span-2">
                                                    <Label className="font-medium">Explanation</Label>
                                                    <Textarea
                                                        {...register(`examples.${language}.explanation`)}
                                                        placeholder="Explain the example"
                                                        className="mt-2 min-h-24 resize-y"
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Additional Information */}
                        <Card className="bg-amber-50 dark:bg-amber-950/20">
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Lightbulb className="w-5 h-5 text-amber-600" />
                                    Additional Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label className="font-medium">Constraints</Label>
                                    <Textarea
                                        {...register("constraints")}
                                        placeholder="Enter problem constraints"
                                        className="mt-2 min-h-24 resize-y font-mono"
                                    />
                                    {errors.constraints && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {errors.constraints.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label className="font-medium">Hints (Optional)</Label>
                                    <Textarea
                                        {...register("hints")}
                                        placeholder="Enter hints for solving the problem"
                                        className="mt-2 min-h-24 resize-y"
                                    />
                                </div>
                                <div>
                                    <Label className="font-medium">Editorial (Optional)</Label>
                                    <Textarea
                                        {...register("editorial")}
                                        placeholder="Enter problem editorial/solution explanation"
                                        className="mt-2 min-h-32 resize-y"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submit Button */}
                        <div className="flex justify-end mt-6">
                            <Button
                                type="submit"
                                size="lg"
                                disabled={isLoading}
                                className="gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-5 h-5" />
                                        Create Problem
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )


};

export default CreateProblemForm;