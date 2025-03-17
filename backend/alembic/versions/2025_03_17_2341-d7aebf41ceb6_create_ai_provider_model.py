"""create ai provider model

Revision ID: d7aebf41ceb6
Revises:
Create Date: 2025-03-17 23:41:09.531320

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "d7aebf41ceb6"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "ai_providers",
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("api_url", sa.String(), nullable=False),
        sa.Column("api_key", sa.String(), nullable=False),
        sa.Column("model", sa.String(), nullable=False),
        sa.Column("priority", sa.Integer(), nullable=False),
        sa.Column(
            "id",
            sa.UUID(),
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_ai_providers")),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("ai_providers")
