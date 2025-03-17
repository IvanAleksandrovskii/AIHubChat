# core/schemas/message.py

from pydantic import BaseModel


class Message(BaseModel):
    content: str
