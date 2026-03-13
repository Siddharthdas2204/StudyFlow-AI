import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Play, Sparkles, Loader2, Terminal, AlertCircle, MessageSquare, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const LANGUAGES = [
  { value: "python", label: "Python", starter: `# Python example\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nfor i in range(10):\n    print(fibonacci(i))` },
  { value: "javascript", label: "JavaScript", starter: `// JavaScript example\nconst fibonacci = (n) => {\n  if (n <= 1) return n;\n  return fibonacci(n-1) + fibonacci(n-2);\n};\n\nfor (let i = 0; i < 10; i++) {\n  console.log(fibonacci(i));\n}` },
  { value: "cpp", label: "C++", starter: `#include <iostream>\nusing namespace std;\n\nint fibonacci(int n) {\n    if (n <= 1) return n;\n    return fibonacci(n-1) + fibonacci(n-2);\n}\n\nint main() {\n    for (int i = 0; i < 10; i++)\n        cout << fibonacci(i) << " ";\n    cout << endl;\n    return 0;\n}` },
  { value: "java", label: "Java", starter: `public class Main {\n    static int fibonacci(int n) {\n        if (n <= 1) return n;\n        return fibonacci(n-1) + fibonacci(n-2);\n    }\n    \n    public static void main(String[] args) {\n        for (int i = 0; i < 10; i++)\n            System.out.print(fibonacci(i) + " ");\n    }\n}` },
  { value: "go", label: "Go", starter: `package main\n\nimport "fmt"\n\nfunc fibonacci(n int) int {\n\tif n <= 1 {\n\t\treturn n\n\t}\n\treturn fibonacci(n-1) + fibonacci(n-2)\n}\n\nfunc main() {\n\tfor i := 0; i < 10; i++ {\n\t\tfmt.Print(fibonacci(i), " ")\n\t}\n}` },
  { value: "rust", label: "Rust", starter: `fn fibonacci(n: u64) -> u64 {\n    if n <= 1 { return n; }\n    fibonacci(n-1) + fibonacci(n-2)\n}\n\nfn main() {\n    for i in 0..10 {\n        print!("{} ", fibonacci(i));\n    }\n}` },
];

type RunResult = { stdout: string; stderr: string; exitCode: number; compileError: string };

export default function CodingPlayground() {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(LANGUAGES[0].starter);
  const [stdin, setStdin] = useState("");
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [explanation, setExplanation] = useState("");
  const [question, setQuestion] = useState("");
  const [running, setRunning] = useState(false);
  const [explaining, setExplaining] = useState(false);
  const [activeTab, setActiveTab] = useState<"output" | "explanation">("output");

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    const starter = LANGUAGES.find(l => l.value === lang)?.starter || "";
    setCode(starter);
    setRunResult(null);
    setExplanation("");
  };

  const handleRun = async () => {
    setRunning(true);
    setActiveTab("output");
    try {
      const res = await fetch("/api/coding/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, stdin }),
      });
      const data = await res.json() as RunResult & { error?: string };
      setRunResult(data);
      if (data.stderr || data.exitCode !== 0 || data.compileError) {
        // Auto-explain errors
        handleExplain(data.stderr || data.compileError || "Runtime error");
      }
    } catch {
      setRunResult({ stdout: "", stderr: "Network error: could not connect to execution service", exitCode: 1, compileError: "" });
    } finally {
      setRunning(false);
    }
  };

  const handleExplain = async (errorText?: string) => {
    setExplaining(true);
    setActiveTab("explanation");
    try {
      const res = await fetch("/api/coding/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          error: errorText || undefined,
          question: question || undefined,
        }),
      });
      const data = await res.json() as { explanation?: string };
      setExplanation(data.explanation || "");
    } catch {
      setExplanation("Failed to get explanation. Please try again.");
    } finally {
      setExplaining(false);
    }
  };

  const currentLang = LANGUAGES.find(l => l.value === language);
  const hasError = runResult && (runResult.stderr || runResult.exitCode !== 0 || runResult.compileError);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 p-4 glass-panel rounded-2xl flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-500/20 rounded-xl">
              <Code2 className="w-7 h-7 text-green-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Coding Playground</h1>
              <p className="text-muted-foreground text-xs">Write, run, and get AI explanations for your code</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {LANGUAGES.map(lang => (
              <button
                key={lang.value}
                onClick={() => handleLanguageChange(lang.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all hidden md:block ${language === lang.value ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
              >
                {lang.label}
              </button>
            ))}
            <select
              className="md:hidden bg-secondary border border-white/10 rounded-lg px-3 py-1.5 text-sm"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
          {/* Code Editor */}
          <div className="flex flex-col glass-panel rounded-2xl overflow-hidden min-h-[400px]">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-background/30 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs text-muted-foreground font-mono">{currentLang?.label}</span>
              </div>
              <button onClick={() => setCode("")} className="text-muted-foreground hover:text-foreground transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 bg-transparent p-4 font-mono text-sm text-foreground resize-none focus:outline-none custom-scrollbar leading-relaxed"
              placeholder={`Write your ${currentLang?.label} code here…`}
              style={{ tabSize: 4 }}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const start = e.currentTarget.selectionStart;
                  const end = e.currentTarget.selectionEnd;
                  setCode(code.substring(0, start) + "    " + code.substring(end));
                  setTimeout(() => { e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4; }, 0);
                }
              }}
            />

            {/* Stdin */}
            <div className="border-t border-white/5 p-3 flex-shrink-0">
              <input
                type="text"
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Standard input (stdin) — optional"
                className="w-full bg-secondary/50 border border-white/5 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary/50"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 p-3 border-t border-white/5 flex-shrink-0">
              <button
                onClick={handleRun}
                disabled={!code.trim() || running}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold disabled:opacity-40 hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 text-sm"
              >
                {running ? <><Loader2 className="w-4 h-4 animate-spin" /> Running…</> : <><Play className="w-4 h-4 fill-current" /> Run Code</>}
              </button>
              <button
                onClick={() => handleExplain()}
                disabled={!code.trim() || explaining}
                className="flex-1 py-2.5 rounded-xl bg-primary/20 border border-primary/30 text-primary font-bold disabled:opacity-40 hover:bg-primary/30 transition-all flex items-center justify-center gap-2 text-sm"
              >
                {explaining ? <><Loader2 className="w-4 h-4 animate-spin" /> Explaining…</> : <><Sparkles className="w-4 h-4" /> Explain Code</>}
              </button>
            </div>
          </div>

          {/* Output + Explanation Panel */}
          <div className="glass-panel rounded-2xl overflow-hidden flex flex-col min-h-[400px]">
            <div className="flex items-center gap-1 px-4 py-2.5 border-b border-white/5 bg-background/30 flex-shrink-0">
              {([["output", Terminal], ["explanation", MessageSquare]] as const).map(([tab, Icon]) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${activeTab === tab ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {tab}
                  {tab === "output" && hasError && <span className="w-2 h-2 rounded-full bg-red-500 ml-1" />}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="wait">
                {activeTab === "output" ? (
                  <motion.div key="output" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
                    {runResult ? (
                      <div className="space-y-3">
                        {runResult.compileError && (
                          <div>
                            <div className="flex items-center gap-2 mb-2 text-red-400 text-xs font-semibold"><AlertCircle className="w-3.5 h-3.5" /> Compile Error</div>
                            <pre className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-xs font-mono text-red-300 overflow-x-auto whitespace-pre-wrap">{runResult.compileError}</pre>
                          </div>
                        )}
                        {runResult.stdout && (
                          <div>
                            <div className="flex items-center gap-2 mb-2 text-green-400 text-xs font-semibold"><Terminal className="w-3.5 h-3.5" /> Output</div>
                            <pre className="bg-black/30 border border-white/5 rounded-xl p-4 text-xs font-mono text-green-300 overflow-x-auto whitespace-pre-wrap">{runResult.stdout}</pre>
                          </div>
                        )}
                        {runResult.stderr && (
                          <div>
                            <div className="flex items-center gap-2 mb-2 text-red-400 text-xs font-semibold"><AlertCircle className="w-3.5 h-3.5" /> Error</div>
                            <pre className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-xs font-mono text-red-300 overflow-x-auto whitespace-pre-wrap">{runResult.stderr}</pre>
                          </div>
                        )}
                        <div className={`text-xs font-medium ${runResult.exitCode === 0 ? "text-green-400" : "text-red-400"}`}>
                          Exit code: {runResult.exitCode}
                        </div>
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-muted-foreground text-sm text-center">
                        <div>
                          <Terminal className="w-10 h-10 opacity-20 mx-auto mb-3" />
                          <p>Click "Run Code" to execute and see output here</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="explanation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
                    {explaining ? (
                      <div className="h-64 flex items-center justify-center">
                        <div className="text-center">
                          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
                          <p className="text-sm text-muted-foreground">AI is analyzing your code…</p>
                        </div>
                      </div>
                    ) : explanation ? (
                      <>
                        <div className="mb-4 flex gap-2">
                          <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Ask a specific question about this code…"
                            className="flex-1 bg-secondary border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            onKeyDown={(e) => e.key === "Enter" && question && handleExplain()}
                          />
                          <button onClick={() => handleExplain()} disabled={!question} className="px-3 py-2 rounded-lg bg-primary/20 text-primary disabled:opacity-40 text-xs">Ask</button>
                        </div>
                        <div className="markdown-body text-sm">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{explanation}</ReactMarkdown>
                        </div>
                      </>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-muted-foreground text-sm text-center">
                        <div>
                          <Sparkles className="w-10 h-10 opacity-20 mx-auto mb-3" />
                          <p>Click "Explain Code" to get AI explanations<br />or ask a specific question about your code</p>
                          <div className="mt-4 flex gap-2 justify-center">
                            <input
                              type="text"
                              value={question}
                              onChange={(e) => setQuestion(e.target.value)}
                              placeholder="What does this code do?"
                              className="bg-secondary border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary w-48"
                              onKeyDown={(e) => e.key === "Enter" && question && handleExplain()}
                            />
                            <button onClick={() => handleExplain()} disabled={!question || explaining} className="px-3 py-2 rounded-lg bg-primary/20 text-primary disabled:opacity-40 text-xs">Ask AI</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
