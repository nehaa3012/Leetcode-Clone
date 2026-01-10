'use client';
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThumbsUp, ThumbsDown, Star, MessageSquare, Sparkles, Loader2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Editor } from "@monaco-editor/react";

const ProblemDescription = ({ problem }) => {
    const [aiSolution, setAiSolution] = React.useState(null);
    const [isGenerating, setIsGenerating] = React.useState(false);

    const handleGenerateSolutionWithAI = async () => {
        setIsGenerating(true);
        try {
            const res = await fetch("/api/generate-solution", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: problem.title,
                    description: problem.description,
                    testCases: problem.testCases,
                    language: 'JAVASCRIPT', // We can optionally detect or let user choose
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setAiSolution(data.solution);
            toast.success("Solution generated!");
        } catch (err) {
            toast.error("Failed to generate solution: " + err.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        if (!aiSolution) return;
        navigator.clipboard.writeText(aiSolution);
        toast.success("Copied to clipboard!");
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'EASY': return 'text-green-500 bg-green-500/10 hover:bg-green-500/20';
            case 'MEDIUM': return 'text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20';
            case 'HARD': return 'text-red-500 bg-red-500/10 hover:bg-red-500/20';
            default: return 'text-gray-500 bg-gray-500/10';
        }
    };

    return (
        <div className="h-full flex flex-col bg-background">
            <Tabs defaultValue="description" className="flex-1 flex flex-col h-full">
                <div className="px-4 pt-2">
                    <TabsList className="w-full justify-start bg-transparent h-10 p-0 rounded-none border-b">
                        <TabsTrigger
                            value="description"
                            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full px-4"
                        >
                            Description
                        </TabsTrigger>
                        <TabsTrigger
                            value="editorial"
                            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full px-4"
                        >
                            Editorial
                        </TabsTrigger>
                        <TabsTrigger
                            value="solutions"
                            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full px-4"
                        >
                            Solutions
                        </TabsTrigger>
                        <TabsTrigger
                            value="submissions"
                            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-full px-4"
                        >
                            Submissions
                        </TabsTrigger>
                    </TabsList>
                </div>

                <ScrollArea className="flex-1">
                    <TabsContent value="description" className="p-4 m-0 space-y-6">
                        {/* Header */}
                        <div className="space-y-4">
                            <h1 className="text-2xl font-bold">{problem.title}</h1>
                            <div className="flex items-center gap-4">
                                <Badge variant="outline" className={`${getDifficultyColor(problem.difficulty)} border-none`}>
                                    {problem.difficulty}
                                </Badge>
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                                        <ThumbsUp className="h-4 w-4" />
                                        <span>1.2K</span>
                                    </div>
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                                        <ThumbsDown className="h-4 w-4" />
                                        <span>45</span>
                                    </div>
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                                        <Star className="h-4 w-4" />
                                    </div>
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                                        <MessageSquare className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="text-sm leading-relaxed space-y-4">
                            <p>{problem.description}</p>
                        </div>

                        {/* Examples */}
                        {problem.examples && Object.keys(problem.examples).length > 0 && (
                            <div className="space-y-4">
                                {Object.entries(problem.examples).map(([lang, example], index) => (
                                    <div key={index} className="space-y-2">
                                        <h3 className="font-semibold text-sm">Example {index + 1}:</h3>
                                        <div className="bg-muted p-3 rounded-md text-sm font-mono space-y-1">
                                            <div><span className="font-semibold text-muted-foreground">Input:</span> {example.input}</div>
                                            <div><span className="font-semibold text-muted-foreground">Output:</span> {example.output}</div>
                                            {example.explanation && (
                                                <div><span className="font-semibold text-muted-foreground">Explanation:</span>
                                                    <div className="whitespace-pre-wrap">{example.explanation}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Constraints */}
                        {problem.constraints && (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">Constraints:</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    {problem.constraints.split('\n').map((constraint, i) => (
                                        <li key={i}>{constraint}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="h-10"></div>
                    </TabsContent>

                    <TabsContent value="editorial" className="p-4 m-0">
                        <div className="prose dark:prose-invert max-w-none">
                            <h3>Editorial</h3>
                            <p className="whitespace-pre-wrap">{problem.editorial || "No editorial available."}</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="solutions" className="p-4 m-0">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-amber-500" />
                                    AI Suggested Solution
                                </h3>
                                <div className="flex gap-2">
                                    {aiSolution && (
                                        <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-2">
                                            <Copy className="h-4 w-4" />
                                            Copy
                                        </Button>
                                    )}
                                    <Button
                                        onClick={handleGenerateSolutionWithAI}
                                        disabled={isGenerating}
                                        size="sm"
                                        className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                                    >
                                        {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                        {aiSolution ? "Regenerate" : "Generate with AI"}
                                    </Button>
                                </div>
                            </div>

                            {aiSolution ? (
                                <div className="border rounded-md overflow-hidden bg-slate-950">
                                    <Editor
                                        height="400px"
                                        language="javascript"
                                        theme="vs-dark"
                                        value={aiSolution}
                                        options={{
                                            readOnly: true,
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            automaticLayout: true,
                                            scrollBeyondLastLine: false,
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
                                    <Sparkles className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                                    <p className="text-muted-foreground text-center max-w-[250px]">
                                        Need help? Click the button above to generate a solution using Gemini AI.
                                    </p>
                                </div>
                            )}

                            <Separator />

                            <div className="space-y-2">
                                <h4 className="font-semibold text-sm">Community Solutions</h4>
                                <p className="text-sm text-muted-foreground">Community discussion and alternative solutions will appear here.</p>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="submissions" className="p-4 m-0">
                        <p className="text-muted-foreground">Submissions tab functionality coming soon.</p>
                    </TabsContent>
                </ScrollArea>
            </Tabs>
        </div>
    );
};

export default ProblemDescription;
