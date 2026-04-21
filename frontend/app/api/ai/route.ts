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
  console.error("❌ RAW HTML RESPONSE:", textResponse);
  return NextResponse.json(
    { error: "AI failed (HTML response from API)" },
    { status: 500 },
  );
}
