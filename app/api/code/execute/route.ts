import { NextRequest, NextResponse } from "next/server";
import { groq, MODELS } from "@/lib/groq";
import axios from "axios";

const LANGUAGE_MAP: Record<string, string> = {
  python: "python3",
  javascript: "javascript",
  typescript: "typescript",
  java: "java",
  cpp: "cpp",
};

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    // 1. Execute Code via Piston
    const pistonRes = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language: LANGUAGE_MAP[language] || language,
      version: "*",
      files: [{ content: code }],
    });

    const executionResult = pistonRes.data.run.output;

    // 2. Get AI Explanation
    const explanationRes = await groq.chat.completions.create({
      model: MODELS.text,
      messages: [
        {
          role: "user",
          content: `You are a coding expert. Analyze this code and its execution output.
          
          CODE:
          ${code}
          
          OUTPUT:
          ${executionResult}
          
          Provide a brief, professional explanation of what the code does, and if there are errors, explain clearly how to fix them in Markdown.`,
        },
      ],
    });

    return NextResponse.json({ 
      output: executionResult,
      explanation: explanationRes.choices[0]?.message?.content || "No explanation available."
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
