import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
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
            content: `Return ONLY JSON resume. No explanation.\n\n${prompt}`,
          },
        ],
      }),
    });

    const data = await res.json();

    const text = data?.choices?.[0]?.message?.content || "No response";

    return NextResponse.json({ text });
  } catch (err) {
    console.error("AI ERROR:", err);
    return NextResponse.json({ error: "AI failed" }, { status: 500 });
  }
}
