# CV DADA ✦ AI-Powered Resume Builder

> Build professional, ATS-ready CVs in minutes — free, no signup required.

🌐 **Live:** [ai-resume-builder-clean-jade.vercel.app](https://ai-resume-builder-clean-jade.vercel.app)

---

   ## Features

- **AI CV Builder** — Describe yourself in plain text, AI generates your entire CV instantly
- **AI Improve** — Rewrite any section (summary, experience, projects) with one click
- **Live Preview** — See changes reflected in real-time on a pixel-perfect A4 canvas
- **PDF Export** — Clean, printable A4 PDF that passes ATS scanners
- **DOCX Export** — Download as Word document for easy editing
- **Passport Photo** — Upload and embed your photo in the CV
- **ATS Friendly** — Times New Roman, clean hierarchy, no tables

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| AI API | OpenRouter (`inclusionai/ling-2.6-flash:free`) |
| PDF Export | jsPDF + html2canvas |
| DOCX Export | docx + file-saver |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/alamnahianofficial/ai-resume-builder-clean.git
cd ai-resume-builder-clean/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the `frontend` folder:

```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxx
```

Get your free API key at [openrouter.ai/keys](https://openrouter.ai/keys)

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx          # Landing page
│   ├── builder/
│   │   └── page.tsx      # Main CV builder UI
│   └── api/
│       └── ai/
│           └── route.ts  # OpenRouter API handler
├── components/
│   └── StandardCV.tsx    # A4 CV preview component
└── public/
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variable:
   - **Name:** `OPENROUTER_API_KEY`
   - **Value:** your OpenRouter key
4. Deploy

---

## How AI Build Works

1. User describes themselves in plain text
2. Frontend sends the text to `/api/ai`
3. `route.ts` builds a structured prompt and calls OpenRouter
4. Model returns a JSON object matching the CV schema
5. Frontend maps the fields and populates the CV instantly

---

## Built By

**Nahian Alam** · [GitHub](https://github.com/alamnahianofficial)

---

> Free · No signup · No watermark · No limits
