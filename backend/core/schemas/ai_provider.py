# core/schemas/ai_provider.py

from uuid import UUID

from pydantic import BaseModel


class AIProviderResponse(BaseModel):
    id: UUID
    name: str
    priority: int

    class Config:
        from_attributes = True
