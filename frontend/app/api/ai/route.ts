import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const res = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
        body: JSON.stringify({
          inputs: `Return ONLY valid JSON resume. No explanation.\n\n${prompt}`,
        }),
      },
    );

    const data = await res.json();

    //  HANDLE ALL HF RESPONSE FORMATS
    let text = "";

    if (Array.isArray(data)) {
      text = data[0]?.generated_text || "";
    } else if (data.generated_text) {
      text = data.generated_text;
    } else if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 500 });
    } else {
      text = JSON.stringify(data);
    }

    return NextResponse.json({ text });
  } catch (err) {
    console.error("AI ERROR:", err);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
