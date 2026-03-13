import { NextRequest, NextResponse } from "next/server";
import { groq, MODELS } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { topic, syllabus, level } = await req.json();

    const prompt = `You are a professional examiner specializing in ${topic}. 
    Based on the provided syllabus/context:
    "${syllabus}"
    
    Level: ${level}
    
    Predict the top 5 most likely exam questions. For each question:
    1. Provide the Question.
    2. Provide the "Likelihood of Appearance" (Percentage).
    3. Provide "Why this is key" (Rationale).
    4. Provide a sample Model Answer.
    
    Format in stunning Markdown.`;

    const response = await groq.chat.completions.create({
      model: MODELS.text,
      messages: [{ role: "user", content: prompt }],
    });

    return NextResponse.json({ 
      predictions: response.choices[0]?.message?.content || "Prediction failed." 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
