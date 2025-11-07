"""
Script de test pour vérifier la connexion à la base de données PostgreSQL
"""
import sys
import io

# Configurer l'encodage UTF-8 pour Windows
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from app.core.config import settings
from app.core.database import engine, SessionLocal
from sqlalchemy import text

def test_connection():
    """Teste la connexion à la base de données"""
    print("=" * 50)
    print("Test de connexion a PostgreSQL")
    print("=" * 50)
    
    # Afficher la configuration (sans le mot de passe)
    print(f"\nConfiguration:")
    print(f"  Host: {settings.POSTGRES_HOST}")
    print(f"  Port: {settings.POSTGRES_PORT}")
    print(f"  Database: {settings.POSTGRES_DB}")
    print(f"  User: {settings.POSTGRES_USER}")
    print(f"  DATABASE_URL: {settings.DATABASE_URL.split('@')[0]}@***")  # Masquer le mot de passe
    
    # Tester la connexion
    print(f"\nTentative de connexion...")
    try:
        with engine.connect() as connection:
            # Exécuter une requête simple
            result = connection.execute(text("SELECT version();"))
            version = result.fetchone()[0]
            print(f"[OK] Connexion reussie!")
            print(f"\nVersion PostgreSQL: {version}")
            
            # Tester une requête sur les tables
            result = connection.execute(text("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"))
            table_count = result.fetchone()[0]
            print(f"Nombre de tables dans le schema public: {table_count}")
            
            return True
            
    except Exception as e:
        print(f"[ERREUR] Erreur de connexion: {str(e)}")
        print(f"\nVerifiez que:")
        print(f"  1. PostgreSQL est demarre")
        print(f"  2. Les identifiants dans votre fichier .env sont corrects")
        print(f"  3. La base de donnees '{settings.POSTGRES_DB}' existe")
        print(f"  4. L'utilisateur '{settings.POSTGRES_USER}' a les permissions necessaires")
        return False

if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)

