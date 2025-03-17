# core/models/mixins/time_stamp_mixin.py

from datetime import datetime

from sqlalchemy import DateTime, func
from sqlalchemy.orm import Mapped, mapped_column


class TimeStampMixin:
    """
    Mixin to add created_at and updated_at timestamp fields to SQLAlchemy models.
    This mixin can be used with any model that inherits from Base.

    Example usage:

    class User(Base, TimeStampMixin):
        '''
        User model with timestamps.
        '''
        pass
    """

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
