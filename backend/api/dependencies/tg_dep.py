# api/auth/tg_dep.py

import logging
from typing import Optional

from fastapi import Header, HTTPException, Request, status

from init_data_py import InitData

from core import settings
from core.models import User


log = logging.getLogger("TG Auth Dependency")


class TelegramInitDependency:
    """
    FastAPI dependency for validating Telegram WebApp init data and extracting user information.
    """

    def __init__(self, bot_token: str, lifetime: int = 3600):
        """
        Initialize the dependency with bot token and optional lifetime.

        Args:
            bot_token: Telegram bot token for validating init data
            lifetime: Time in seconds for which the init data is considered valid (default: 3600)
        """
        self.bot_token = bot_token
        self.lifetime = lifetime

    async def __call__(
        self,
        request: Request,
        telegram_web_app_data: Optional[str] = Header(
            None, alias="X-Telegram-Web-App-Data"
        ),
    ) -> User:
        """
        Extract and validate Telegram init data from the request.

        Args:
            request: FastAPI request object
            telegram_web_app_data: Init data from Telegram Web App header

        Returns:
            User: Extracted user information

        Raises:
            HTTPException: If validation fails or required data is missing
        """
        # Check header presence
        if not telegram_web_app_data:
            # Try to get init_data from query params as fallback
            init_data_str = request.query_params.get("initData")
            if not init_data_str:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Missing Telegram Web App data",
                )
            telegram_web_app_data = init_data_str

        try:
            # Parse and validate the init data
            init_data = InitData.parse(telegram_web_app_data)

            is_valid = init_data.validate(
                bot_token=self.bot_token, lifetime=self.lifetime
            )

            if not is_valid:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid Telegram Web App data",
                )

            # Extract user information
            if not init_data.user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User information missing in init data",
                )

            # Create user object with extracted data
            user = User(
                # Can add more fields here if needed like first_name, last_name, etc.
                username=getattr(init_data.user, "username", None),
                chat_id=init_data.chat_instance,
            )

            return user

        except Exception as e:
            log.error(f"Error validating Telegram init data: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Failed to validate Telegram data: {str(e)}",
            )


# Dependency factory function
def verify_telegram_user(bot_token: str, lifetime: int = 3600):
    """
    Factory function to create a TelegramInitDependency with the specified bot token.

    Args:
        bot_token: Telegram bot token for validating init data
        lifetime: Time in seconds for which the init data is considered valid

    Returns:
        Callable: Dependency function that validates Telegram init data
    """
    return TelegramInitDependency(bot_token=bot_token, lifetime=lifetime)


# Global dependency for all routes
tg_dep = verify_telegram_user(bot_token=settings.bot.token)


"""
Example usage:

@app.get("/protected-endpoint")
async def protected_endpoint(user: TelegramUser = Depends(telegram_auth)):
    return {
        "message": f"Hello, {user.username}!",
        "user_id": user.user_id,
        "username": user.username
    }
"""
