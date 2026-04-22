import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("✅ API HIT");

  try {
    const { prompt } = await req.json();

    return NextResponse.json({
      message: "Backend working",
      prompt,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "fail" }, { status: 500 });
  }
}
