import { NextRequest, NextResponse } from "next/server";
import { groq, MODELS } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;
    const subject = formData.get("subject") as string || "General";
    
    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const buffer = await image.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");
    
    const response = await groq.chat.completions.create({
      model: MODELS.vision,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a world-class academic tutor. Solve the problem in this image step-by-step. 
              Subject: ${subject}
              
              Provide:
              1. A clear statement of the problem identified.
              2. Key concepts and formulas involved.
              3. A detailed step-by-step solution.
              4. A "Why it works" section to build intuition.
              
              Format in clean Markdown with professional headings.`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${image.type};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1500,
    });

    return NextResponse.json({ 
      solution: response.choices[0]?.message?.content || "Unable to solve." 
    });
  } catch (error: any) {
    console.error("Solver Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
