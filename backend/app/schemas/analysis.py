from pydantic import BaseModel, Field
from typing import Literal


class LeadAnalysis(BaseModel):
    score: int = Field(ge=0, le=100)
    category: Literal["high", "medium", "low"]
    reasoning: str
    recommended_action: str