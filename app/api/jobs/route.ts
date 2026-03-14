import { NextResponse } from 'next/server';
import { groq, MODELS } from '@/lib/groq';

export async function POST(req: Request) {
  try {
    const { bio } = await req.json();
    
    const userProfile = bio && bio.trim() !== "" ? bio : "Computer Science student looking for entry-level software engineering, data analysis, or tech roles. Skilled in React, Node, Python.";

    const prompt = `You are an AI Job matching engine for StudyFlow AI. Based on the following user profile, generate 2 highly relevant tech job openings that currently reflect the market.
User Profile: "${userProfile}"

You must respond EXACTLY with a JSON object containing a "jobs" array. NO markdown formatting around the json, no backticks.
The JSON must have the exact following shape:
{
  "jobs": [
    {
      "id": "1",
      "title": "string (e.g., MERN Stack Developer)",
      "company": "string (e.g., TechNova Solutions)",
      "match": "string (e.g., 98%)",
      "location": "string (e.g., Remote or Hybrid)",
      "type": "string (e.g., Full-Time or Contract)"
    }
  ]
}

DO NOT wrap in markdown like \`\`\`json. Return ONLY valid JSON block.`;

    const completion = await groq.chat.completions.create({
      model: MODELS.text,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content || '{"jobs": []}';
    let parsed = { jobs: [] };
    
    try {
      parsed = JSON.parse(content);
    } catch(e) {
      console.error("Failed to parse JSON", e);
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("Jobs API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch AI jobs" }, { status: 500 });
  }
}
