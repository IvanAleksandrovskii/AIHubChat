# api/ai_views.py

from typing import Optional, List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.models import (
    db_helper,
    AIProvider,
    User,
)
from core.schemas import Message
from core.schemas.ai_provider import AIProviderResponse
from services.ai_services import Response
from services import (
    Response,
    get_ai_response,
)

from api.dependencies import tg_dep


router = APIRouter()


@router.post("/message/", response_model=Response)
async def process_message(
    message: Message,
    ai_model_id: Optional[UUID] = None,
    db: AsyncSession = Depends(db_helper.session_getter),
    user: User = Depends(tg_dep),
) -> Response:
    """Process a message and return an AI-generated response."""
    try:
        return await get_ai_response(db, message.content, ai_model_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong while processing the message. Please try again later.",
        )


@router.get("/models/", response_model=List[AIProviderResponse])
async def get_all_ai_models(
    db: AsyncSession = Depends(db_helper.session_getter),
    user: User = Depends(tg_dep),
) -> List[AIProviderResponse]:
    """List all available AI models."""
    try:
        query = AIProvider.active().order_by(AIProvider.priority)
        providers = await db.execute(query)
        return [
            AIProviderResponse.model_validate(provider)
            for provider in providers.scalars().all()
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong while retrieving the AI models. Please try again later.",
        )
