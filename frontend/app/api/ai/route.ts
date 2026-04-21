import { NextRequest, NextResponse } from "next/server";

// 🔒 simple rate limiter
let lastCall = 0;

export async function POST(req: NextRequest) {
  try {
    // 🚫 Rate limit (3 sec)
    if (Date.now() - lastCall < 3000) {
      return NextResponse.json(
        { error: "Too fast. Please wait." },
        { status: 429 }
      );
    }
    lastCall = Date.now();

    const { prompt } = await req.json();

    // 🔑 check API key
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "Missing API key in Vercel env" },
        { status: 500 }
      );
    }

    const res = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            {
              role: "user",
              content: `
Return ONLY valid JSON.
Do NOT include explanation or markdown.

Format:
{
  "full_name": "",
  "email": "",
  "phone": "",
  "location": "",
  "summary": "",
  "education": [],
  "experience": [],
  "projects": [],
  "skills": [],
  "certifications": [],
  "references": [],
  "extras": []
}

User input:
${prompt}
              `,
            },
          ],
        }),
      }
    );

    // 🔥 read raw text (important fix)
    const textResponse = await res.text();

    console.log("🧠 RAW OPENROUTER RESPONSE:", textResponse);

    let data;

    try {
      data = JSON.parse(textResponse);
    } catch (err) {
      console.error("❌ Not JSON response:", textResponse);

      return NextResponse.json(
        { error: "AI returned invalid (HTML/text) response" },
        { status: 500 }
      );
    }

    // ❌ API error from OpenRouter
    if (!res.ok) {
      console.error("❌ OpenRouter error:", data);

      return NextResponse.json(
        { error: data?.error?.message || "AI request failed" },
        { status: 500 }
      );
    }

    const text =
      data?.choices?.[0]?.message?.content?.trim() || "";

    if (!text) {
      return NextResponse.json(
        { error: "Empty AI response" },
        { status: 500 }
      );
    }

    return NextResponse.json({ text });

  } catch (err) {
    console.error("❌ FINAL AI ERROR:", err);

    return NextResponse.json(
      { error: "AI failed. Please try again." },
      { status: 500 }
    );
  }
}