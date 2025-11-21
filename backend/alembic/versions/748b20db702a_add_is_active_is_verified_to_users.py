"""add_is_active_is_verified_to_users

Revision ID: 748b20db702a
Revises: 84300c3c651e
Create Date: 2025-11-10 15:24:51.335149

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision: str = '748b20db702a'
down_revision: Union[str, Sequence[str], None] = '84300c3c651e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def column_exists(table_name: str, column_name: str) -> bool:
    """Vérifie si une colonne existe dans une table."""
    bind = op.get_bind()
    inspector = inspect(bind)
    columns = [col['name'] for col in inspector.get_columns(table_name)]
    return column_name in columns


def upgrade() -> None:
    """Upgrade schema."""
    # Vérifier et ajouter les colonnes seulement si elles n'existent pas déjà
    if not column_exists('users', 'is_active'):
        op.add_column('users', sa.Column('is_active', sa.Boolean(), nullable=True))
    
    if not column_exists('users', 'is_verified'):
        op.add_column('users', sa.Column('is_verified', sa.Boolean(), nullable=True))
    
    if not column_exists('users', 'updated_at'):
        op.add_column('users', sa.Column('updated_at', sa.DateTime(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    # Supprimer les colonnes seulement si elles existent
    if column_exists('users', 'updated_at'):
        op.drop_column('users', 'updated_at')
    
    if column_exists('users', 'is_verified'):
        op.drop_column('users', 'is_verified')
    
    if column_exists('users', 'is_active'):
        op.drop_column('users', 'is_active')
