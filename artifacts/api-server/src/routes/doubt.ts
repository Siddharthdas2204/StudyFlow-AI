import { Router } from "express";
import multer from "multer";
import { groq } from "../lib/groq.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post("/doubt/solve", upload.single("image"), async (req, res) => {
  try {
    const subject = req.body.subject || "General";
    const extraContext = req.body.context || "";

    if (!req.file) {
      res.status(400).json({ error: "Image file is required" });
      return;
    }

    const base64Image = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype || "image/jpeg";

    const response = await groq.chat.completions.create({
      model: "llama-3.2-11b-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert academic tutor. Analyze this image containing a question or problem (it may be handwritten or printed) and provide a clear, step-by-step explanation and solution.

Subject context: ${subject}
${extraContext ? `Additional context: ${extraContext}` : ""}

Please:
1. Identify the question or problem shown in the image
2. Explain the key concepts involved
3. Provide a detailed step-by-step solution
4. Highlight important formulas, theorems, or rules used
5. Provide any helpful tips or common mistakes to avoid

Format your response in clear markdown with proper headings and steps.`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 2048,
    });

    const solution = response.choices[0]?.message?.content || "Unable to analyze the image.";
    res.json({ solution });
  } catch (error: unknown) {
    console.error("Doubt solver error:", error);
    const message = error instanceof Error ? error.message : "Failed to solve doubt";
    res.status(500).json({ error: message });
  }
});

export default router;
