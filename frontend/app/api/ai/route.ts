import { NextRequest, NextResponse } from "next/server";

function extractJSON(text: string) {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : null;
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

function buildPrompt(input: string) {
  return `
You are an ATS resume generator.

STRICT RULES:
- Output ONLY JSON
- No explanation
- No markdown
- No text before or after JSON
- Must follow schema exactly

If invalid JSON is generated, FIX it internally.

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
"education": [],
"experience": [],
"projects": [],
"skills": [],
"certifications": [],
"references": [],
"extras": []
}

INPUT:
${input}
`;
}

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
      model: "mistralai/mistral-7b-instruct", // 🔥 stable
      messages: [
        {
          role: "system",
          content: "You ONLY return valid JSON. No extra text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 1200,
    }),
  });

  const data = await res.json();

  const content = data?.choices?.[0]?.message?.content;

  console.log("AI RAW:", content);

  if (!content) throw new Error("Empty AI response");

  return content;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    let attempts = 0;
    let parsed = null;

    while (attempts < 3 && !parsed) {
      try {
        const raw = await callAI(buildPrompt(prompt));

        const cleaned = extractJSON(raw);

        if (!cleaned) {
          attempts++;
          continue;
        }

        parsed = JSON.parse(cleaned);
      } catch (err) {
        console.log("Retrying...", err);
        attempts++;
      }
    }

    if (!parsed) {
      return NextResponse.json(fallback());
    }

    // 🔹 Guarantee schema safety
    return NextResponse.json({
      full_name: parsed.full_name || "",
      email: parsed.email || "",
      phone: parsed.phone || "",
      location: parsed.location || "",
      linkedin: parsed.linkedin || "",
      github: parsed.github || "",
      portfolio: parsed.portfolio || "",
      summary: parsed.summary || "",
      education: parsed.education || [],
      experience: parsed.experience || [],
      projects: parsed.projects || [],
      skills: parsed.skills || [],
      certifications: parsed.certifications || [],
      references: parsed.references || [],
      extras: parsed.extras || []
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json(fallback());
  }
}
