import { NextRequest, NextResponse } from "next/server";
import { groq, MODELS } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio");

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // In a real app, you'd send this to Whisper or Deepgram
    // For now, we'll simulate transcription and then use LLM to summarize
    
    const prompt = `You are a world-class academic transcriber. I have a lecture recording. 
    Please generate a set of highly detailed, structured study notes for this lecture.
    Inclue:
    - Main Topic
    - Key Concepts (with definitions)
    - Detailed Explanations
    - Examples used
    - Summary points
    - Potential Exam Questions
    
    Format in beautiful Markdown with emojis.`;

    const response = await groq.chat.completions.create({
      model: MODELS.text,
      messages: [{ role: "user", content: prompt }],
    });

    return NextResponse.json({ 
      notes: response.choices[0]?.message?.content || "Failed to generate notes."
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
