import { NextResponse } from 'next/server';
// @ts-ignore
import { getSubtitles } from 'youtube-captions-scraper';
import { groq, MODELS } from '@/lib/groq';

function extractVideoID(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "Missing YouTube URL" }, { status: 400 });

    const videoId = extractVideoID(url);
    if (!videoId) {
      return NextResponse.json({ error: "Invalid YouTube URL format." }, { status: 400 });
    }

    let transcriptResponse;
    try {
      transcriptResponse = await getSubtitles({
        videoID: videoId,
        lang: 'en' 
      });
    } catch (err: any) {
       console.error("Caption Scraper Error:", err);
       return NextResponse.json({ 
         error: "This video does not have English closed captions (CC) enabled. Please try an educational video with subtitles." 
       }, { status: 400 });
    }

    if (!transcriptResponse || transcriptResponse.length === 0) {
      return NextResponse.json({ error: "Could not extract transcript data from this video." }, { status: 400 });
    }

    // Limit transcript length to avoid token limits
    const fullText = transcriptResponse.map((t: any) => t.text).join(' ').substring(0, 15000);

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
