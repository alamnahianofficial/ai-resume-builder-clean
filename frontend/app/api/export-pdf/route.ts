import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { html } = await req.json();

    const executablePath =
      process.env.NODE_ENV === "production"
        ? await chromium.executablePath()
        : undefined;

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: true,
    });

    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "15mm", bottom: "15mm", left: "0mm", right: "0mm" },
    });

    await browser.close();

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resume.pdf"',
      },
    });
  } catch (err) {
    console.error("PDF ERROR:", err);
    return NextResponse.json({ error: "PDF failed" }, { status: 500 });
  }
}
