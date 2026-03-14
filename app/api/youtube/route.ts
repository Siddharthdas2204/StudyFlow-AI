import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import { groq, MODELS } from '@/lib/groq';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "Missing YouTube URL" }, { status: 400 });

    const transcriptResponse = await YoutubeTranscript.fetchTranscript(url);
    if (!transcriptResponse || transcriptResponse.length === 0) {
      return NextResponse.json({ error: "Could not fetch transcript. The video might not have closed captions enabled." }, { status: 400 });
    }

    // Limit transcript length to avoid token limits
    const fullText = transcriptResponse.map(t => t.text).join(' ').substring(0, 15000);

    const prompt = `You are a world-class academic summarizer from StudyFlow AI. Summarize the following YouTube video transcript into highly structured study notes.
Include:
- Main Topic
- Key Concepts (with definitions)
- Detailed Explanations
- Examples used
- Summary points

Format in beautiful Markdown. Here is the transcript:
${fullText}`;

    const completion = await groq.chat.completions.create({
      model: MODELS.text,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    return NextResponse.json({ notes: completion.choices[0]?.message?.content || "Failed to generate notes." });
  } catch (error: any) {
    console.error("YouTube Error:", error);
    return NextResponse.json({ error: error.message || "Something went wrong fetching the video." }, { status: 500 });
  }
}
