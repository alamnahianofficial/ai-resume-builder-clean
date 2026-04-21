const res = await fetch(
  "https://api-inference.huggingface.co/models/google/flan-t5-large",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.HF_API_KEY}`,
    },
    body: JSON.stringify({
      inputs: `Return ONLY JSON resume.\n\n${prompt}`,
    }),
  },
);

const textResponse = await res.text();

let data;

try {
  data = JSON.parse(textResponse);
} catch (e) {
  console.error("❌ RAW RESPONSE:", textResponse);
  return NextResponse.json(
    { error: "AI returned non-JSON (likely API key / model issue)" },
    { status: 500 },
  );
}

// 🔥 HANDLE ALL POSSIBLE RESPONSE FORMATS
let text = "";

if (Array.isArray(data)) {
  text = data[0]?.generated_text || "";
} else if (data.generated_text) {
  text = data.generated_text;
} else if (data.error) {
  console.error("❌ HF ERROR:", data.error);
  return NextResponse.json({ error: data.error }, { status: 500 });
} else {
  console.warn("⚠️ Unknown response shape:", data);
  text = JSON.stringify(data);
}

// ✅ RETURN TO FRONTEND (VERY IMPORTANT)
return NextResponse.json({ text });
