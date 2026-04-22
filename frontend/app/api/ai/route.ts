import { NextRequest, NextResponse } from "next/server";

function extractJSON(text: string): string | null {
  const stripped = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  const start = stripped.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let end = -1;
  for (let i = start; i < stripped.length; i++) {
    if (stripped[i] === "{") depth++;
    else if (stripped[i] === "}") {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }

  if (end === -1) return null;
  return stripped.slice(start, end + 1);
}

function fallback() {
  return {
    full_name: "", email: "", phone: "", location: "",
    linkedin: "", github: "", portfolio: "",
    summary: "AI failed to generate. Please try again.",
    education: [], experience: [], projects: [],
    skills: [], certifications: [], references: [], extras: [],
  };
}

// ✅ FIXED: schema now matches frontend field names exactly
function buildPrompt(input: string): string {
  return `You are an ATS resume generator. Output ONLY a single valid JSON object, no markdown, no explanation.

Use this EXACT schema (fill all fields from the user input):
{
  "full_name": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "linkedin": "string",
  "github": "string",
  "portfolio": "string",
  "summary": "2-3 sentence professional summary",
  "education": [{ "institution": "string", "degree": "string", "cgpa": "string", "duration": "string" }],
  "experience": [{ "role": "string", "org": "string", "duration": "string", "bullets": "bullet1\nbullet2\nbullet3" }],
  "projects": [{ "name": "string", "link": "string", "duration": "string", "bullets": "bullet1\nbullet2" }],
  "skills": [{ "category": "string", "skills": "skill1, skill2, skill3" }],
  "certifications": [{ "name": "string", "issuer": "string", "date": "string" }],
  "references": [],
  "extras": []
}

IMPORTANT RULES:
- education[].institution NOT education[].school
- experience[].role NOT experience[].title
- experience[].org NOT experience[].company
- experience[].bullets = newline separated string NOT an array
- projects[].bullets = newline separated string NOT an array
- skills[].category and skills[].skills are strings NOT arrays
- Fill every field you can infer from the input
- If info is missing, use empty string "" not null

User input:
${input}`;
}

async function callAI(prompt: string): Promise<string> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://cvdada.vercel.app",
      "X-Title": "CV DADA",
    },
    body: JSON.stringify({
      model: "inclusionai/ling-2.6-flash:free",
      messages: [
        {
          role: "system",
          content: "You are a JSON-only API. Never output markdown or explanations. Your entire response is always a single valid JSON object.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 3000,
    }),
  });

  const data = await res.json();

  if (data?.error) {
    console.error("❌ OpenRouter API error:", JSON.stringify(data.error));
    throw new Error(`OpenRouter error: ${data.error?.message || JSON.stringify(data.error)}`);
  }

  if (!res.ok) {
    console.error("❌ HTTP error:", res.status, JSON.stringify(data));
    throw new Error(`HTTP ${res.status}`);
  }

  console.log("✅ OpenRouter raw response:", JSON.stringify(data, null, 2));

  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    console.error("❌ No content in response. Full data:", JSON.stringify(data));
    throw new Error("No AI response");
  }

  console.log("✅ AI raw content:", content);
  return content;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return NextResponse.json({ error: "Missing or empty prompt" }, { status: 400 });
    }

    let parsed = null;
    const MAX_ATTEMPTS = 3;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        console.log(`🔁 Attempt ${attempt}/${MAX_ATTEMPTS}`);
        const raw = await callAI(buildPrompt(prompt));
        const cleaned = extractJSON(raw);

        if (!cleaned) {
          console.warn(`⚠️ Attempt ${attempt}: extractJSON returned null. Raw:`, raw);
          continue;
        }

        console.log(`✅ Attempt ${attempt}: cleaned JSON:`, cleaned);
        parsed = JSON.parse(cleaned);
        break;
      } catch (err) {
        console.error(`❌ Attempt ${attempt} failed:`, (err as Error).message);
      }
    }

    if (!parsed) {
      console.error("❌ All attempts failed. Returning fallback.");
      return NextResponse.json(fallback());
    }

    // ✅ Map with frontend-compatible field names
    return NextResponse.json({
      full_name: parsed.full_name || "",
      email: parsed.email || "",
      phone: parsed.phone || "",
      location: parsed.location || "",
      linkedin: parsed.linkedin || "",
      github: parsed.github || "",
      portfolio: parsed.portfolio || "",
      summary: parsed.summary || "",
      education: Array.isArray(parsed.education)
        ? parsed.education.map((e: Record<string, string>) => ({
            institution: e.institution || "",
            degree: e.degree || "",
            cgpa: e.cgpa || "",
            duration: e.duration || "",
          }))
        : [],
      experience: Array.isArray(parsed.experience)
        ? parsed.experience.map((e: Record<string, string>) => ({
            role: e.role || e.title || "",
            org: e.org || e.company || "",
            duration: e.duration || "",
            bullets: e.bullets || e.description || "",
          }))
        : [],
      projects: Array.isArray(parsed.projects)
        ? parsed.projects.map((p: Record<string, string>) => ({
            name: p.name || "",
            link: p.link || "",
            duration: p.duration || "",
            bullets: p.bullets || p.description || "",
          }))
        : [],
      skills: Array.isArray(parsed.skills)
        ? typeof parsed.skills[0] === "string"
          ? [{ category: "Skills", skills: parsed.skills.join(", ") }] // handle if model returns string[]
          : parsed.skills.map((s: Record<string, string>) => ({
              category: s.category || "",
              skills: s.skills || "",
            }))
        : [],
      certifications: Array.isArray(parsed.certifications)
        ? parsed.certifications.map((c: Record<string, string>) => ({
            name: c.name || "",
            issuer: c.issuer || "",
            date: c.date || c.year || "",
          }))
        : [],
      references: Array.isArray(parsed.references) ? parsed.references : [],
      extras: Array.isArray(parsed.extras) ? parsed.extras : [],
    });
  } catch (err) {
    console.error("❌ SERVER ERROR:", err);
    return NextResponse.json(fallback(), { status: 500 });
  }
}
