from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional

class WorkExperience(BaseModel):
    company: str = ""
    role: str = ""
    location: str = ""
    duration: str = ""
    bullets: List[str] = []

class Education(BaseModel):
    school: str = ""
    degree: str = ""
    year: str = ""

class ResumeSchema(BaseModel):
    full_name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    summary: str = ""
    experience: List[WorkExperience] = []
    education: List[Education] = []
    skills: List[str] = []

class ImprovementResponse(BaseModel):
    improved_data: ResumeSchema
    suggestions: List[str]
    ats_score: int