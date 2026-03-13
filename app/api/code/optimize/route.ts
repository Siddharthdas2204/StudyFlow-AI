import { NextRequest, NextResponse } from "next/server";
import { groq, MODELS } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    const prompt = `You are an expert senior software engineer. Please optimize and refactor the following ${language} code.
    
    CODE:
    ${code}
    
    Ensure it is clean, efficient, and follows best practices. If there are obvious bugs, fix them. Return ONLY the optimized code without any explanation or markdown backticks unless strictly necessary for the code itself.`;

    const response = await groq.chat.completions.create({
      model: MODELS.text,
      messages: [{ role: "user", content: prompt }],
    });

    return NextResponse.json({ 
      optimizedCode: response.choices[0]?.message?.content || code
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
