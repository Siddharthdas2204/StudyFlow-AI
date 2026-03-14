import { NextResponse } from 'next/server';
import { groq, MODELS } from '@/lib/groq';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "Missing text input" }, { status: 400 });
    }

    // Limit transcript length to avoid token limits
    const fullText = text.substring(0, 15000);

    const prompt = `You are a world-class academic summarizer from StudyFlow AI. Summarize the following raw text into highly structured study notes.
Include:
- Main Topic
- Key Concepts (with definitions)
- Detailed Explanations
- Examples used
- Summary points

Format in beautiful Markdown. Here is the text to summarize:
${fullText}`;

    const completion = await groq.chat.completions.create({
      model: MODELS.text,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    return NextResponse.json({ notes: completion.choices[0]?.message?.content || "Failed to generate notes." });
  } catch (error: any) {
    console.error("Text Notes Error:", error);
    return NextResponse.json({ error: error.message || "Something went wrong generating notes from text." }, { status: 500 });
  }
}
