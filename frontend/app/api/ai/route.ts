import { NextRequest, NextResponse } from "next/server";

function extractJSON(text: string) {
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1) return null;
  return text.slice(first, last + 1);
}

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

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    let attempts = 0;
    let parsed = null;

    while (attempts < 3 && !parsed) {
      try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.3-8b-instruct:free",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
            max_tokens: 1200,
          }),
        });

        const data = await res.json();
        const content = data?.choices?.[0]?.message?.content;

        if (!content) {
          attempts++;
          continue;
        }

        const cleaned = extractJSON(content);
        if (!cleaned) {
          attempts++;
          continue;
        }

        parsed = JSON.parse(cleaned);
      } catch {
        attempts++;
      }
    }

    if (!parsed) {
      return NextResponse.json(fallback());
    }

    return NextResponse.json(parsed);

  } catch (err) {
    console.error(err);
    return NextResponse.json(fallback());
  }
}
