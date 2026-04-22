import { NextRequest, NextResponse } from "next/server";

// ✅ Strip markdown fences + extract outermost valid JSON object
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
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  if (end === -1) return null;
  return stripped.slice(start, end + 1);
}

// ✅ Safe fallback if all attempts fail
function fallback() {
  return {
    full_name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: "AI failed to generate. Please try again.",
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
    references: [],
    extras: [],
  };
}

// ✅ Strict prompt that forces JSON-only output
function buildPrompt(input: string): string {
  return `You are an ATS resume generator. Your ONLY output is a single valid JSON object. No explanation, no markdown, no text before or after.

Required JSON schema:
{
  "full_name": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "linkedin": "string",
  "github": "string",
  "portfolio": "string",
  "summary": "string (2-3 sentences)",
  "education": [{ "degree": "", "institution": "", "year": "" }],
  "experience": [{ "title": "", "company": "", "duration": "", "description": "" }],
  "projects": [{ "name": "", "description": "", "tech": "" }],
  "skills": ["skill1", "skill2"],
  "certifications": [{ "name": "", "issuer": "", "year": "" }],
  "references": [],
  "extras": []
}

User input:
${input}

Respond with ONLY the JSON object. Start your response with { and end with }.`;
}

// ✅ Call OpenRouter API with the new free model
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
      model: "inclusionai/ling-2.6-flash:free", // ✅ free, 262K context, Apr 2026
      messages: [
        {
          role: "system",
          content:
            "You are a JSON-only API. Never output markdown or explanations. Your entire response is always a single valid JSON object.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 3000,
    }),
  });

  const data = await res.json();

  // ✅ OpenRouter returns HTTP 200 even for errors — must check data.error
  if (data?.error) {
    console.error("❌ OpenRouter API error:", JSON.stringify(data.error));
    throw new Error(
      `OpenRouter error: ${data.error?.message || JSON.stringify(data.error)}`
    );
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

// ✅ Main POST handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body?.prompt;

    // Guard: reject empty or missing prompt
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return NextResponse.json(
        { error: "Missing or empty prompt" },
        { status: 400 }
      );
    }

    let parsed = null;
    const MAX_ATTEMPTS = 3;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        console.log(`🔁 Attempt ${attempt}/${MAX_ATTEMPTS}`);

        const raw = await callAI(buildPrompt(prompt));
        const cleaned = extractJSON(raw);

        if (!cleaned) {
          console.warn(`⚠️ Attempt ${attempt}: extractJSON returned null`);
          console.warn("Raw was:", raw);
          continue;
        }

        console.log(`✅ Attempt ${attempt}: cleaned JSON:`, cleaned);
        parsed = JSON.parse(cleaned);
        break; // success — stop retrying
      } catch (err) {
        console.error(`❌ Attempt ${attempt} failed:`, (err as Error).message);
      }
    }

    if (!parsed) {
      console.error("❌ All attempts failed. Returning fallback.");
      return NextResponse.json(fallback());
    }

    // ✅ Return schema-safe response
    return NextResponse.json({
      full_name: parsed.full_name || "",
      email: parsed.email || "",
      phone: parsed.phone || "",
      location: parsed.location || "",
      linkedin: parsed.linkedin || "",
      github: parsed.github || "",
      portfolio: parsed.portfolio || "",
      summary: parsed.summary || "",
      education: Array.isArray(parsed.education) ? parsed.education : [],
      experience: Array.isArray(parsed.experience) ? parsed.experience : [],
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      certifications: Array.isArray(parsed.certifications)
        ? parsed.certifications
        : [],
      references: Array.isArray(parsed.references) ? parsed.references : [],
      extras: Array.isArray(parsed.extras) ? parsed.extras : [],
    });
  } catch (err) {
    console.error("❌ SERVER ERROR:", err);
    return NextResponse.json(fallback(), { status: 500 });
  }
}
