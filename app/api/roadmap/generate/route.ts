import { NextRequest, NextResponse } from "next/server";
import { groq, MODELS } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { goal, timeframe, level } = await req.json();

    const prompt = `You are a career and academic advisor. Create a comprehensive study roadmap for the following:
    GOAL: ${goal}
    TIMEFRAME: ${timeframe}
    LEVEL: ${level}
    
    Structure the roadmap into:
    1. Phase 1: Fundamentals (Weeks 1-2)
    2. Phase 2: Core Mastery (Weeks 3-5)
    3. Phase 3: Project/Practical Application (Weeks 6-8)
    4. Essential Resources (Books, Courses, Docs)
    5. Success Metrics (How to know you've mastered it)
    
    Use exciting and motivational Markdown formatting with checklists.`;

    const response = await groq.chat.completions.create({
      model: MODELS.text,
      messages: [{ role: "user", content: prompt }],
    });

    return NextResponse.json({ 
      roadmap: response.choices[0]?.message?.content || "Roadmap generation failed." 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
