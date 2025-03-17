# core/models/user.py

from sqlalchemy import String, BigInteger, Boolean
from sqlalchemy.orm import Mapped, mapped_column  # , relationship

from pydantic import EmailStr

from .base import Base
from core.models.mixins import TimeStampMixin


class User(Base, TimeStampMixin):
    """ 
    Could be made with fastapi-users, for now keeping it simple
    """
    
    # Telegram-specific fields
    chat_id: Mapped[int] = mapped_column(
        BigInteger, nullable=True, unique=True, index=True
    )
    username: Mapped[str] = mapped_column(String, nullable=True)

    # is_superuser: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # phone_number: Mapped[str] = mapped_column(String(255), nullable=True)  # Don't need it
    # email: Mapped[EmailStr] = mapped_column(String(255), nullable=True, unique=True, index=True)
    # is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    # hashed_password: Mapped[str] = mapped_column(String(255), nullable=True)

    def __str__(self):
        username = f"username={self.username}" if self.username else "username=None"
        chat_id = f"chat_id={self.chat_id}" if self.chat_id else "chat_id=None"
        return f"{username}, {chat_id}"

    def __repr__(self) -> str:
        return f"User({self.__str__()})"
