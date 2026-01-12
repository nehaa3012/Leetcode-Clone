'use client';

import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Send, Settings, RotateCcw } from 'lucide-react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { executeCode } from "@/app/action/codeExecution"; // Import server action
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const ProblemEditor = ({ problem }) => {
    const router = useRouter();
    const [language, setLanguage] = useState('JAVASCRIPT');
    const [code, setCode] = useState('');
    const [activeTab, setActiveTab] = useState('testcase');
    const [isRunning, setIsRunning] = useState(false);
    const [testResults, setTestResults] = useState(null);

    // Initialize code based on selected language
    useEffect(() => {
        if (problem.codeSnippets && problem.codeSnippets[language]) {
            setCode(problem.codeSnippets[language]);
        } else {
            setCode('// No snippet available for this language');
        }
    }, [language, problem.codeSnippets]);

    const handleLanguageChange = (value) => {
        setLanguage(value);
    };

    const handleReset = () => {
        if (confirm("Are you sure you want to reset the code to default?")) {
            setCode(problem.codeSnippets[language]);
        }
    };

    const getEditorLanguage = (lang) => {
        switch (lang) {
            case 'JAVASCRIPT': return 'javascript';
            case 'JAVA': return 'java';
            case 'PYTHON': return 'python';
            default: return 'javascript';
        }
    };

    const handleRun = async () => {
        setIsRunning(true);
        setActiveTab('result'); // Switch to results tab
        setTestResults(null);

        try {
            // For "Run", we run against the visible test cases (examples)
            // problem.testCases contains the visible cases we showed in the UI
            const result = await executeCode({
                code,
                language,
                problemId: problem.id,
                mode: 'RUN',
                inputs: problem.testCases // We explicit pass these to be sure
            });

            if (result.error) {
                toast.error(result.error);
                setTestResults({ error: result.error, details: result.details });
            } else {
                setTestResults(result);
                if (result.results.every(r => r.passed)) {
                    toast.success("All test cases passed!");
                } else {
                    toast.warning("Some test cases failed.");
                }
            }
        } catch (err) {
            toast.error("Execution failed");
            console.error(err);
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = async () => {
        setIsRunning(true);
        setActiveTab('result');
        setTestResults(null);

        try {
            const result = await executeCode({
                code,
                language,
                problemId: problem.id,
                mode: 'SUBMIT',
            });
            if(result.success == true){
                router.push('/problems')
            }

            if (result.error) {
                toast.error(result.error);
                setTestResults({ error: result.error, details: result.details });
            } else {
                setTestResults(result);
                if (result.results.every(r => r.passed)) {
                    toast.success("Accepted!");
                } else {
                    toast.error("Wrong Answer");
                }
            }
        } catch (err) {
            toast.error("Submission failed");
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <ResizablePanelGroup direction="vertical" className="h-full border-l">
            {/* Top Half: Code Editor */}
            <ResizablePanel defaultSize={60} minSize={30}>
                <div className="flex flex-col h-full">
                    {/* Editor Toolbar */}
                    <div className="flex items-center justify-between p-2 border-b bg-muted/40 h-12">
                        <div className="flex items-center gap-2">
                            <Select value={language} onValueChange={handleLanguageChange}>
                                <SelectTrigger className="w-[140px] h-8 text-xs">
                                    <SelectValue placeholder="Language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="JAVASCRIPT">JavaScript</SelectItem>
                                    <SelectItem value="PYTHON">Python</SelectItem>
                                    <SelectItem value="JAVA">Java</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={handleReset}>
                                <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                <Settings className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Monaco Editor */}
                    <div className="flex-1 overflow-hidden">
                        <Editor
                            height="100%"
                            language={getEditorLanguage(language)}
                            value={code}
                            onChange={(value) => setCode(value)}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 13,
                                lineNumbers: 'on',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                padding: { top: 10, bottom: 10 },
                            }}
                        />
                    </div>
                </div>
            </ResizablePanel>

            <ResizableHandle />

            {/* Bottom Half: Test Cases & Results */}
            <ResizablePanel defaultSize={40} minSize={20}>
                <div className="flex flex-col h-full bg-background">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                        <div className="px-4 pt-2 border-b">
                            <TabsList className="bg-transparent h-8 p-0">
                                <TabsTrigger
                                    value="testcase"
                                    className="data-[state=active]:bg-transparent data-[state=active]:text-foreground text-muted-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-4 text-xs font-medium"
                                >
                                    Testcase
                                </TabsTrigger>
                                <TabsTrigger
                                    value="result"
                                    className="data-[state=active]:bg-transparent data-[state=active]:text-foreground text-muted-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-4 text-xs font-medium"
                                >
                                    Test Result
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <ScrollArea className="flex-1">
                            <div className="p-4">
                                <TabsContent value="testcase" className="m-0 space-y-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        {problem.testCases && problem.testCases.map((_, index) => (
                                            <Button
                                                key={index}
                                                variant="secondary"
                                                size="sm"
                                                className="h-7 text-xs"
                                            >
                                                Case {index + 1}
                                            </Button>
                                        ))}
                                    </div>

                                    {problem.testCases && problem.testCases.length > 0 && (
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <div className="text-xs font-medium text-muted-foreground">Input:</div>
                                                <div className="bg-muted p-3 rounded-md font-mono text-sm">
                                                    {problem.testCases[0].input}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-xs font-medium text-muted-foreground">Expected Output:</div>
                                                <div className="bg-muted p-3 rounded-md font-mono text-sm">
                                                    {problem.testCases[0].output}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </TabsContent>
                                <TabsContent value="result" className="m-0">
                                    {isRunning ? (
                                        <div className="flex flex-col items-center justify-center h-40 gap-3">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            <div className="text-sm text-muted-foreground">Running Code...</div>
                                        </div>
                                    ) : testResults ? (
                                        <div className="space-y-4">
                                            {testResults.error ? (
                                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md">
                                                    <h3 className="font-semibold text-red-500 mb-2">{testResults.error}</h3>
                                                    <pre className="text-xs font-mono whitespace-pre-wrap bg-background p-2 rounded">{testResults.details || "Unknown error occurred"}</pre>
                                                </div>
                                            ) : (
                                                <div className="space-y-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`text-xl font-bold ${testResults.results.every(r => r.passed) ? 'text-green-500' : 'text-red-500'}`}>
                                                            {testResults.results.every(r => r.passed) ? 'Accepted' : 'Wrong Answer'}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {testResults.results.filter(r => r.passed).length} / {testResults.results.length} test cases passed
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {testResults.results.map((res, idx) => (
                                                            <div key={idx} className="space-y-2 border rounded-md p-3">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="font-medium text-sm">Case {idx + 1}</span>
                                                                    <Badge variant={res.passed ? "default" : "destructive"} className={res.passed ? "bg-green-600 hover:bg-green-700" : ""}>
                                                                        {res.passed ? "Passed" : "Failed"}
                                                                    </Badge>
                                                                </div>
                                                                {!res.passed && (
                                                                    <div className="space-y-2 mt-2 text-sm">
                                                                        <div className="space-y-1">
                                                                            <span className="text-xs text-muted-foreground">Input:</span>
                                                                            <div className="bg-muted p-2 rounded font-mono text-xs">{res.input}</div>
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <span className="text-xs text-muted-foreground">Expected:</span>
                                                                            <div className="bg-muted p-2 rounded font-mono text-xs">{res.expectedOutput}</div>
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <span className="text-xs text-muted-foreground">Output:</span>
                                                                            <div className="bg-muted p-2 rounded font-mono text-xs">{res.actualOutput}</div>
                                                                        </div>
                                                                        {res.error && (
                                                                            <div className="space-y-1">
                                                                                <span className="text-xs text-destructive">Error:</span>
                                                                                <div className="bg-red-500/10 p-2 rounded font-mono text-xs text-destructive">{res.error}</div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm">
                                            Run your code to see results
                                        </div>
                                    )}
                                </TabsContent>
                            </div>
                        </ScrollArea>

                        <div className="p-4 border-t flex items-center justify-between bg-muted/20">
                            <Button variant="secondary" size="sm" className="gap-2">
                                Console
                            </Button>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="gap-2 w-24"
                                    onClick={handleRun}
                                    disabled={isRunning}
                                >
                                    {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                                    Run
                                </Button>
                                <Button
                                    size="sm"
                                    className="gap-2 w-24 bg-green-600 hover:bg-green-700 text-white"
                                    onClick={handleSubmit}
                                    disabled={isRunning}
                                >
                                    {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                    Submit 
                                </Button>
                                
                            </div>
                        </div>
                    </Tabs>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
};

export default ProblemEditor;
