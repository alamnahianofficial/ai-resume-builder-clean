import { NextRequest, NextResponse } from "next/server";

let lastCall = 0;

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
    linkedin": "",
    github": "",
    portfolio": "",
    summary": "AI failed. Try again.",
    education": [],
    experience": [],
    projects": [],
    skills": [],
    certifications": [],
    references": [],
    extras": []
  };
}

async function callAI(prompt: string) {
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

  if (!content) throw new Error("No AI response");

  return content;
}

export async function POST(req: NextRequest) {
  console.log("✅ API HIT");

  try {
    // rate limit
    if (Date.now() - lastCall < 2000) {
      return NextResponse.json(fallback());
    }
    lastCall = Date.now();

    const { prompt } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json(fallback());
    }

    let attempts = 0;
    let parsed = null;

    while (attempts < 3 && !parsed) {
      try {
        const raw = await callAI(prompt);

        const cleaned = extractJSON(raw);

        if (!cleaned) {
          attempts++;
          continue;
        }

        parsed = JSON.parse(cleaned);
      } catch (err) {
        console.error("Retry:", err);
        attempts++;
      }
    }

    if (!parsed) {
      return NextResponse.json(fallback());
    }

    return NextResponse.json(parsed);

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json(fallback());
  }
}
