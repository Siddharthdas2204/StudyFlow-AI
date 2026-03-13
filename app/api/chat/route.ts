import { NextRequest } from "next/server";
import { groq, MODELS } from "@/lib/groq";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { messages, subject } = await req.json();

    const systemPrompt = `You are Socrates, a world-class academic tutor. 
    Subject Profile: ${subject || "General Academic Support"}
    
    Guidelines:
    1. Don't just give answers. Ask guiding questions to help the student reach the conclusion.
    2. Use simple analogies for complex topics.
    3. Be encouraging and patient.
    4. Format output in clean Markdown.
    5. If a student is frustrated, simplify the concepts further.`;

    const response = await groq.chat.completions.create({
      model: MODELS.text,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || "";
          controller.enqueue(encoder.encode(content));
        }
        controller.close();
      },
    });

    return new Response(stream);
  } catch (error: any) {
    console.error("Chat Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
