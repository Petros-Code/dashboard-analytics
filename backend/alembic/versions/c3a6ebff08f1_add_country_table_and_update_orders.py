"""add_country_table_and_update_orders

Revision ID: c3a6ebff08f1
Revises: d88dfcad96f5
Create Date: 2025-11-20 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c3a6ebff08f1'
down_revision: Union[str, Sequence[str], None] = 'd88dfcad96f5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Créer la table countries
    op.create_table('countries',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('code', sa.String(length=10), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('code')
    )
    
    # Ajouter la colonne country_id à la table orders (nullable pour permettre la migration)
    op.add_column('orders', sa.Column('country_id', sa.Integer(), nullable=True))
    
    # Migrer les données existantes de country_code vers countries
    # Insérer les pays uniques depuis orders.country_code dans countries
    # Utiliser ON CONFLICT pour éviter les doublons si la migration est exécutée plusieurs fois
    op.execute("""
        INSERT INTO countries (code, name, created_at)
        SELECT DISTINCT 
            country_code as code,
            country_code as name,  -- Utiliser le code comme nom par défaut
            NOW() as created_at
        FROM orders
        WHERE country_code IS NOT NULL
        ON CONFLICT (code) DO NOTHING
    """)
    
    # Mettre à jour orders.country_id avec les IDs correspondants
    op.execute("""
        UPDATE orders
        SET country_id = countries.id
        FROM countries
        WHERE orders.country_code = countries.code
    """)
    
    # Créer la contrainte de clé étrangère
    op.create_foreign_key(
        'fk_orders_country_id',
        'orders', 'countries',
        ['country_id'], ['id']
    )
    
    # Supprimer l'ancienne colonne country_code
    op.drop_column('orders', 'country_code')


def downgrade() -> None:
    """Downgrade schema."""
    # Ajouter la colonne country_code
    op.add_column('orders', sa.Column('country_code', sa.String(length=10), nullable=True))
    
    # Migrer les données de country_id vers country_code avant de supprimer la FK
    op.execute("""
        UPDATE orders
        SET country_code = countries.code
        FROM countries
        WHERE orders.country_id = countries.id
    """)
    
    # Supprimer la contrainte de clé étrangère
    op.drop_constraint('fk_orders_country_id', 'orders', type_='foreignkey')
    
    # Supprimer la colonne country_id
    op.drop_column('orders', 'country_id')
    
    # Supprimer la table countries
    op.drop_table('countries')

