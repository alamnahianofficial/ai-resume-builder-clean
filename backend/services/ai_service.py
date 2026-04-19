import os
import json
from openai import OpenAI
from schemas.resume import ResumeSchema

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def process_ai_enhancement(data: ResumeSchema):
    prompt = f"""
    You are an expert ATS (Applicant Tracking System) optimizer. 
    Rewrite the following resume data to:
    1. Use the STAR method for bullet points.
    2. Incorporate strong industry action verbs.
    3. Ensure the summary is keyword-rich for high-ranking.
    
    Data: {data.model_dump_json()}
    
    Return a JSON object with two keys:
    'improved_data': The full updated resume object.
    'suggestions': A list of 3 specific career tips.
    'score': An integer from 0-100.
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a professional resume writer. Always return valid JSON."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"}
    )

    result = json.loads(response.choices[0].message.content)
    return result