import { NextRequest, NextResponse } from "next/server";

let lastCall = 0;

// 🔹 Extract JSON safely
function extractJSON(text: string) {
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1) return null;
  return text.slice(first, last + 1);
}

// 🔹 Safe fallback (never break UI)
function fallback() {
  return {
    full_name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: "AI failed. Please try again.",
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
    references: [],
    extras: []
  };
}

// 🔹 Strict prompt builder
function buildPrompt(input: string) {
  return `
You are a professional ATS resume generator.

CRITICAL RULES:
- Return ONLY valid JSON
- No explanation
- No markdown
- No extra text
- Must match schema EXACTLY
- No null values (use "" or [])

SCHEMA:
{
"full_name": "",
"email": "",
"phone": "",
"location": "",
"linkedin": "",
"github": "",
"portfolio": "",
"summary": "",
"education": [
{"institution":"","degree":"","cgpa":"","start_date":"","end_date":""}
],
"experience": [
{"company":"","role":"","start_date":"","end_date":"","bullets":[]}
],
"projects": [
{"name":"","description":"","bullets":[]}
],
"skills": [
{"name":""}
],
"certifications": [
{"name":"","issuer":""}
],
"references": [],
"extras": []
}

USER INPUT:
${input}

OUTPUT:
Return ONLY JSON.
`;
}

// 🔹 Call OpenRouter
async function callAI(prompt: string) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://cvdada.vercel.app",
      "X-Title": "CV DADA",
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct", // 🔥 more stable than free llama
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 1200,
    }),
  });

  const data = await res.json();

  console.log("🧠 RAW AI:", data);

  const content = data?.choices?.[0]?.message?.content;

  if (!content) throw new Error("No AI response");

  return content;
}

// 🔹 MAIN HANDLER
export async function POST(req: NextRequest) {
  console.log("✅ API HIT");

  try {
    // 🔸 Rate limit
    if (Date.now() - lastCall < 1500) {
      return NextResponse.json(fallback());
    }
    lastCall = Date.now();

    const { prompt } = await req.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(fallback());
    }

    let attempts = 0;
    let parsed = null;

    while (attempts < 3 && !parsed) {
      try {
        const raw = await callAI(buildPrompt(prompt));

        console.log("📦 RAW TEXT:", raw);

        const cleaned = extractJSON(raw);

        if (!cleaned) {
          attempts++;
          continue;
        }

        parsed = JSON.parse(cleaned);
      } catch (err) {
        console.error("🔁 Retry:", err);
        attempts++;
      }
    }

    if (!parsed) {
      return NextResponse.json(fallback());
    }

    // 🔹 Guarantee schema safety
    parsed.full_name ||= "";
    parsed.email ||= "";
    parsed.phone ||= "";
    parsed.location ||= "";
    parsed.linkedin ||= "";
    parsed.github ||= "";
    parsed.portfolio ||= "";
    parsed.summary ||= "";
    parsed.education ||= [];
    parsed.experience ||= [];
    parsed.projects ||= [];
    parsed.skills ||= [];
    parsed.certifications ||= [];
    parsed.references ||= [];
    parsed.extras ||= [];

    return NextResponse.json(parsed);

  } catch (err) {
    console.error("❌ SERVER ERROR:", err);
    return NextResponse.json(fallback());
  }
}
