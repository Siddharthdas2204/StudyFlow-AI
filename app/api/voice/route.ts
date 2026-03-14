import { NextResponse } from 'next/server';
import { groq, MODELS } from '@/lib/groq';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const prompt = `You are Socrates, an elite, highly intelligent AI tutor for StudyFlow. The user is speaking to you via Voice.
Respond to the following utterance. Keep your response conversational, extremely clear, educational, and relatively concise (under 80 words if possible) so it sounds natural when spoken back.

User says: "${message}"`;

    const completion = await groq.chat.completions.create({
      model: MODELS.text,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that. Could you repeat?";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Voice Tutor API Error:", error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}
