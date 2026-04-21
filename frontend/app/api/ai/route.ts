import { NextRequest, NextResponse } from "next/server";

let lastCall = 0;

export async function POST(req: NextRequest) {
  try {
    if (Date.now() - lastCall < 3000) {
      return NextResponse.json(
        { error: "Too fast. Please wait." },
        { status: 429 },
      );
    }
    lastCall = Date.now();

    const body = await req.json();
    const { prompt } = body;

    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: "No prompt provided" },
        { status: 400 },
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 });
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://cvdada.vercel.app",
        "X-Title": "CV DADA",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-8b-instruct:free",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const rawText = await res.text();
    console.log("RAW OPENROUTER:", rawText.slice(0, 300));

    let data: any;
    try {
      data = JSON.parse(rawText);
    } catch {
      console.error("Non-JSON from OpenRouter:", rawText.slice(0, 200));
      return NextResponse.json(
        { error: "AI returned invalid response" },
        { status: 500 },
      );
    }

    if (!res.ok || data.error) {
      console.error("OpenRouter error:", data.error);
      return NextResponse.json(
        { error: data?.error?.message || "AI request failed" },
        { status: 500 },
      );
    }

    const text = data?.choices?.[0]?.message?.content?.trim() ?? "";

    if (!text) {
      return NextResponse.json({ error: "Empty AI response" }, { status: 500 });
    }

    return NextResponse.json({ text });
  } catch (err) {
    console.error("AI route error:", err);
    return NextResponse.json(
      { error: "AI failed. Please try again." },
      { status: 500 },
    );
  }
}
