import { NextRequest, NextResponse } from "next/server";

// Strip markdown fences AND extract the outermost JSON object
function extractJSON(text: string): string | null {
  // Remove markdown code fences like ```json ... ``` or ``` ... ```
  const stripped = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  // Find the first { and the MATCHING last }
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

function buildPrompt(input: string) {
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
      model: "mistralai/mistral-small",  // ✅ more reliable than 7b for JSON
      messages: [
        {
          role: "system",
          content:
            "You are a JSON-only API. You never output markdown, explanations, or code fences. Your entire response is always a single valid JSON object.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,       // ✅ lower = more deterministic
      max_tokens: 2000,       // ✅ was 1200, too small for full resume JSON
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("OpenRouter HTTP error:", res.status, errText);
    throw new Error(`OpenRouter error: ${res.status}`);
  }

  const data = await res.json();

  // Log the full response for debugging
  console.log("OpenRouter full response:", JSON.stringify(data, null, 2));

  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    console.error("Empty content. Full data:", JSON.stringify(data));
    throw new Error("Empty AI response");
  }

  console.log("AI RAW CONTENT:", content);
  return content;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body?.prompt;

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
        console.log(`Attempt ${attempt}/${MAX_ATTEMPTS}`);
        const raw = await callAI(buildPrompt(prompt));
        const cleaned = extractJSON(raw);

        if (!cleaned) {
          console.warn(`Attempt ${attempt}: extractJSON returned null. Raw:`, raw);
          continue;
        }

        console.log(`Attempt ${attempt}: Cleaned JSON:`, cleaned);
        parsed = JSON.parse(cleaned);
        break; // ✅ success — stop retrying
      } catch (err) {
        console.error(`Attempt ${attempt} failed:`, err);
      }
    }

    if (!parsed) {
      console.error("All attempts failed. Returning fallback.");
      return NextResponse.json(fallback());
    }

    // Guaranteed safe schema output
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
      certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
      references: Array.isArray(parsed.references) ? parsed.references : [],
      extras: Array.isArray(parsed.extras) ? parsed.extras : [],
    });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json(fallback(), { status: 500 });
  }
}
