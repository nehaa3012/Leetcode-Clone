
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateProblem(topic) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const prompt = `
    Generate a coding problem about "${topic}" in JSON format.
    The output must strictly follow the JSON structure below. Do NOT use markdown code blocks (like \`\`\`json). Just return the raw JSON string.
    
    Structure:
    {
      "title": "Problem Title",
      "description": "Problem description...",
      "difficulty": "EASY" | "MEDIUM" | "HARD",
      "problemType": "NUMBER" | "STRING",
      "tags": ["tag1", "tag2"],
      "constraints": "Constraint 1\\nConstraint 2",
      "hints": "Hint 1...",
      "editorial": "Explanation of the solution...",
      "testCases": [
        { "input": "input_value", "output": "expected_output" }
      ],
      "codeSnippets": {
        "JAVASCRIPT": "starter code...",
        "PYTHON": "starter code...",
        "JAVA": "starter code..."
      },
      "referenceSolutions": {
        "JAVASCRIPT": "complete solution...",
        "PYTHON": "complete solution...",
        "JAVA": "complete solution..."
      },
      "examples": {
        "JAVASCRIPT": { "input": "...", "output": "...", "explanation": "..." },
        "PYTHON": { "input": "...", "output": "...", "explanation": "..." },
        "JAVA": { "input": "...", "output": "...", "explanation": "..." }
      }
    }
    
    IMPORTANT:
    1. For "problemType": use "NUMBER" if input is primarily a number (e.g. n=5), use "STRING" if input is primarily a string (e.g. s="hello").
    2. testCases inputs must stay formatted correctly for the code runners.
    3. Ensure codeSnippets and referenceSolutions use standard function names like 'solution', 'climbStairs', 'isPalindrome' etc matching the problem. Be consistent across languages.
    4. Provide valid code that can actually run.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up potential markdown if the model disobeys
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        throw new Error("Failed to generate problem using Gemini");
    }
}


// generate solution
export async function generateSolution(problemTitle, problemDescription, testCases, language) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const prompt = `
    Generate a ${language} solution for the following coding problem:
    
    Title: ${problemTitle}
    Description: ${problemDescription}
    
    Test Cases (for context):
    ${JSON.stringify(testCases, null, 2)}
    
    The output must strictly follow the JSON structure below. Do NOT use markdown code blocks. Just return the raw JSON string.
    
    Structure:
    {
      "solution": "the complete solution code here..."
    }
    
    IMPORTANT:
    1. Ensure the solution is valid and can actually run.
    2. Use standard function names matching the problem. Be consistent.
    3. Return ONLY the JSON.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up potential markdown if the model disobeys
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Gemini Solution Error:", error);
        throw new Error("Failed to generate solution using Gemini");
    }
}