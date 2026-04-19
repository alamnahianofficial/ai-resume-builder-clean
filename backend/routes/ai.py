from fastapi import APIRouter

router = APIRouter(prefix="/ai")

@router.post("/generate-summary")
def generate_summary(data: dict):
    role = data.get("role", "developer")

    return {
        "summary": f"Developed impactful solutions as a {role}, improving performance and delivering scalable systems."
    }


@router.post("/suggest")
def suggest_improvements(data: dict):
    jd = data.get("job_description", "").lower()

    suggestions = []

    if "python" in jd:
        suggestions.append("Add Python experience if missing")

    if "api" in jd:
        suggestions.append("Mention API development experience")

    if "team" in jd:
        suggestions.append("Highlight teamwork and collaboration")

    if "performance" in jd:
        suggestions.append("Include performance improvements with metrics")

    if not suggestions:
        suggestions.append("Add more measurable achievements and action verbs")

    return {
        "suggestions": suggestions
    }