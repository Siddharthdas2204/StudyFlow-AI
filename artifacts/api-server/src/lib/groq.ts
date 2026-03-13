import Groq from "groq-sdk";

let _client: Groq | null = null;

export function getGroqClient(): Groq {
  if (!_client) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is required");
    }
    _client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _client;
}

export const MODEL = "llama-3.3-70b-versatile";

export async function groqChat(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  jsonMode = false
): Promise<string> {
  const client = getGroqClient();
  const completion = await client.chat.completions.create({
    model: MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 4096,
    ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
  });
  return completion.choices[0]?.message?.content ?? "";
}

export const groq = new Proxy({} as Groq, {
  get(_target, prop) {
    return (getGroqClient() as Record<string | symbol, unknown>)[prop];
  },
});
