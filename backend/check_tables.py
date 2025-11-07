"""
Script pour vérifier les tables existantes dans la base de données
"""
import sys
import io

# Configurer l'encodage UTF-8 pour Windows
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from app.core.config import settings
from app.core.database import engine
from sqlalchemy import text, inspect

def check_tables():
    """Vérifie quelles tables existent dans la base de données"""
    print("=" * 60)
    print("Verification des tables dans la base de donnees")
    print("=" * 60)
    
    print(f"\nBase de donnees: {settings.POSTGRES_DB}")
    print(f"Schema: public\n")
    
    try:
        with engine.connect() as connection:
            # Lister toutes les tables dans le schéma public
            query = text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_type = 'BASE TABLE'
                ORDER BY table_name;
            """)
            
            result = connection.execute(query)
            tables = [row[0] for row in result]
            
            if tables:
                print(f"[OK] {len(tables)} table(s) trouvee(s) dans le schema 'public':\n")
                for table in tables:
                    print(f"  - {table}")
            else:
                print("[ERREUR] Aucune table trouvee dans le schema 'public'")
                print("\nLes tables doivent etre creees via les migrations Alembic.")
                print("Executez: poetry run alembic upgrade head")
            
            # Vérifier aussi les tables attendues depuis models.py
            expected_tables = [
                'users', 'roles', 'users_roles', 'categories', 'marketplaces',
                'customers', 'products', 'product_marketplaces', 'orders',
                'order_items', 'promo_codes', 'order_promo_codes',
                'import_batches', 'social_media_stats', 'website_analytics'
            ]
            
            missing_tables = [t for t in expected_tables if t not in tables]
            
            if missing_tables:
                print(f"\n[ATTENTION] Tables manquantes ({len(missing_tables)}):")
                for table in missing_tables:
                    print(f"  - {table}")
                print("\n-> Creez une nouvelle migration avec: poetry run alembic revision --autogenerate -m 'ajout_toutes_tables'")
                print("-> Puis executez: poetry run alembic upgrade head")
            
            return len(tables) > 0
            
    except Exception as e:
        print(f"[ERREUR] Erreur: {str(e)}")
        return False

if __name__ == "__main__":
    success = check_tables()
    sys.exit(0 if success else 1)

