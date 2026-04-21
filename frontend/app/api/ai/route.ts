import { NextRequest, NextResponse } from "next/server";

// simple global rate limiter
let lastCall = 0;

export async function POST(req: NextRequest) {
  try {
    // 🔒 RATE LIMIT (fix position)
    if (Date.now() - lastCall < 3000) {
      return NextResponse.json(
        { error: "Too fast. Please wait." },
        { status: 429 },
      );
    }

    lastCall = Date.now();

    const { prompt } = await req.json();

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
  "education": [],
  "experience": [],
  "skills": []
}

User:
${prompt}
            `,
          },
        ],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("API ERROR:", data);
      return NextResponse.json({ error: "AI request failed" }, { status: 500 });
    }

    const text = data?.choices?.[0]?.message?.content || "";

    return NextResponse.json({ text });
  } catch (err) {
    console.error("AI ERROR:", err);
    return NextResponse.json({ error: "AI failed" }, { status: 500 });
  }
}
