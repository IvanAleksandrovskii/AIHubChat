# services/ai_services.py

from typing import Optional
from dataclasses import dataclass
import httpx
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from fastapi import HTTPException, status

from core import log
from core.models import (
    AIProvider,
    client_manager,
)


# TODO: Can move to schemas but that's makes no sense for me
@dataclass
class Response:
    status_code: int
    content: str
    ai_model: str | None
    request_content: str


async def query_ai_provider(model: AIProvider, message: str) -> Optional[str]:
    retries = 2 # TODO: Move to config
    try:
        uber_client = await client_manager.get_client()
    except Exception as e:
        log.error(f"Error getting client for %s: %s", model.name, e)
        return None

    if not uber_client:
        log.warning(f"No client available for %s, retrying", model.name)
        uber_client = await client_manager.get_client()
        if not uber_client:
            log.error(
                f"No client available for %s, cannot get http client. Something went wrong.",
                model.name,
            )
            raise Exception(
                f"No client available, cannot get http client. Something went wrong."
            )

    # Debug logging
    log.debug(f"Querying AI provider: {model.name}")
    log.debug(f"API URL: {model.api_url}")
    # log.debug(f"API Key (first 5 chars): {model.api_key[:5]}...")
    # log.debug(f"Headers: {model.get_headers()}")
    # log.debug(f"Payload: {model.get_request_payload(message)}")

    for attempt in range(retries):
        try:
            response = await uber_client.client.post(
                model.api_url,
                json=model.get_request_payload(message),
                headers=model.get_headers(),
                timeout=30.0,
                # Add these lines to control compression
                extensions={
                    "decompress_response": True  # Explicitly handle response decompression
                },
            )
            response.raise_for_status()
            parsed_response = await model.parse_response(response.json())
            log.debug(
                f"AI response: {parsed_response[:100]}..."
            )  # Log first 100 chars of response
            return parsed_response
        except httpx.HTTPStatusError as e:
            log.error(f"HTTP error response: {e.response.text}")
            if e.response.status_code == 429:
                log.warning(f"Rate limit exceeded for %s", model.name)
                return None
            log.error(f"Failed to query %s: %s, attempt %s", model.name, e, attempt + 1)
        except (httpx.RequestError, KeyError) as e:
            log.error(f"Error querying %s: %s", model.name, e)
        finally:
            if uber_client:
                await client_manager.release_client(uber_client)

    return None


async def get_ai_response(
    db: AsyncSession, message: str, specific_model: Optional[UUID] = None
) -> Response:
    if specific_model:
        model = await db.execute(
            select(AIProvider).where(AIProvider.id == specific_model)
        )
        model = model.scalars().first()
        if not model:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Specified AI model not found.",
            )

        response = await query_ai_provider(model, message)
        if response:
            return Response(
                status_code=200,
                request_content=message,
                content=response,
                ai_model=model.name,
            )
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="No successful response from specified AI model.",
        )

    models_query = AIProvider.active().order_by(AIProvider.priority)
    result = await db.execute(models_query)
    ai_models = result.scalars().all()

    if not ai_models:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active AI models found.",
        )

    for model in ai_models:
        log.info(f"Trying AI model: {model.name}")
        response = await query_ai_provider(model, message)
        if response:
            return Response(
                status_code=200,
                request_content=message,
                content=response,
                ai_model=model.name,
            )

    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail="No successful response from any AI models.",
    )
