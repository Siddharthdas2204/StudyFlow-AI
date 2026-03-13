import { Router } from "express";
import { groq } from "../lib/groq.js";

const router = Router();

const PISTON_API = "https://emkc.org/api/v2/piston";

// Map language names to Piston runtime names
const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
  cpp: { language: "cpp", version: "10.2.0" },
  c: { language: "c", version: "10.2.0" },
  typescript: { language: "typescript", version: "5.0.3" },
  go: { language: "go", version: "1.16.2" },
  rust: { language: "rust", version: "1.50.0" },
  ruby: { language: "ruby", version: "3.0.1" },
  php: { language: "php", version: "8.2.3" },
  swift: { language: "swift", version: "5.3.3" },
  kotlin: { language: "kotlin", version: "1.8.20" },
};

router.post("/coding/run", async (req, res) => {
  try {
    const { code, language = "python", stdin = "" } = req.body as {
      code: string;
      language: string;
      stdin?: string;
    };

    if (!code?.trim()) {
      res.status(400).json({ error: "Code is required" });
      return;
    }

    const runtime = LANGUAGE_MAP[language.toLowerCase()] || LANGUAGE_MAP.python;

    const pistonRes = await fetch(`${PISTON_API}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: runtime.language,
        version: runtime.version,
        files: [{ name: `main.${language === "python" ? "py" : language}`, content: code }],
        stdin,
        run_timeout: 10000,
        compile_timeout: 10000,
      }),
    });

    if (!pistonRes.ok) {
      throw new Error("Code execution service unavailable");
    }

    const result = await pistonRes.json() as {
      run: { stdout: string; stderr: string; code: number; signal: string | null };
      compile?: { stdout: string; stderr: string; code: number };
      message?: string;
    };

    res.json({
      stdout: result.run?.stdout || "",
      stderr: result.run?.stderr || "",
      exitCode: result.run?.code ?? 0,
      compileError: result.compile?.stderr || "",
      language: runtime.language,
    });
  } catch (error: unknown) {
    console.error("Code execution error:", error);
    const message = error instanceof Error ? error.message : "Failed to execute code";
    res.status(500).json({ error: message });
  }
});

router.post("/coding/explain", async (req, res) => {
  try {
    const { code, error: codeError, language = "python", question = "" } = req.body as {
      code: string;
      error?: string;
      language?: string;
      question?: string;
    };

    const prompt = codeError
      ? `Explain this ${language} error and how to fix it:\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\`\n\nError:\n\`\`\`\n${codeError}\n\`\`\`\n\nProvide:\n1. What caused the error\n2. Step-by-step fix\n3. The corrected code\n4. Tips to avoid this error in future`
      : question
      ? `${question}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\``
      : `Analyze and explain this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide:\n1. What the code does (overview)\n2. Step-by-step explanation of each section\n3. Time/space complexity if applicable\n4. Potential improvements or best practices\n5. Any bugs or issues you notice`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert programming tutor. Provide clear, educational explanations of code, errors, and programming concepts. Always format code with proper markdown code blocks.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
    });

    const explanation = response.choices[0]?.message?.content || "Unable to explain the code.";
    res.json({ explanation });
  } catch (error: unknown) {
    console.error("Code explain error:", error);
    res.status(500).json({ error: "Failed to explain code" });
  }
});

export default router;
