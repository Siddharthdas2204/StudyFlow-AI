import { NextRequest, NextResponse } from "next/server";
import { groq, MODELS } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { query, pdfName } = await req.json();

    const prompt = `You are an AI research assistant. The user is asking a question about a PDF document named "${pdfName}".
    
    USER QUERY: ${query}
    
    Provide a detailed, accurate answer based on the context of a typical academic document. If you don't know, suggest where in the document they might find the answer (e.g., Introduction, Methodology).`;

    const response = await groq.chat.completions.create({
      model: MODELS.text,
      messages: [{ role: "user", content: prompt }],
    });

    return NextResponse.json({ 
      answer: response.choices[0]?.message?.content || "I couldn't find an answer in the PDF."
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
