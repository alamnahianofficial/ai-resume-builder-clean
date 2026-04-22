import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("✅ API HIT");

  try {
    const body = await req.json();
    console.log("📥 BODY:", body);

    return NextResponse.json({
      status: "backend working",
      received: body,
    });

  } catch (err) {
    console.error("❌ ERROR:", err);

    return NextResponse.json(
      { error: "Backend crashed" },
      { status: 500 }
    );
  }
}
