"""
Script pour exécuter les migrations Alembic avec Poetry
"""
import sys
import os
import subprocess

def run_with_poetry():
    """Exécute la migration avec Poetry"""
    print("Exécution de la migration Alembic avec Poetry...")
    try:
        result = subprocess.run(
            ["python", "-m", "poetry", "run", "alembic", "upgrade", "head"],
            cwd=os.path.dirname(__file__),
            check=True
        )
        print("Migration terminée avec succès!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Erreur lors de l'exécution de la migration: {e}")
        return False
    except FileNotFoundError:
        print("Poetry n'est pas disponible. Tentative avec Python direct...")
        return False

def run_with_python():
    """Exécute la migration directement avec Python (fallback)"""
    # Ajouter le répertoire courant au path
    sys.path.insert(0, os.path.dirname(__file__))
    
    try:
        from alembic.config import Config
        from alembic import command
        
        # Charger la configuration Alembic
        alembic_cfg = Config("alembic.ini")
        
        # Exécuter la migration
        print("Exécution de la migration Alembic...")
        command.upgrade(alembic_cfg, "head")
        print("Migration terminée avec succès!")
        return True
        
    except ImportError as e:
        print(f"Erreur: Alembic n'est pas installé. {e}")
        print("\nPour installer les dépendances avec Poetry, exécutez:")
        print("  cd dashboard-analytics/backend")
        print("  python -m poetry install")
        print("\nPuis réessayez:")
        print("  python -m poetry run alembic upgrade head")
        return False
    except Exception as e:
        print(f"Erreur lors de l'exécution de la migration: {e}")
        return False

if __name__ == "__main__":
    # Essayer d'abord avec Poetry (méthode recommandée)
    if not run_with_poetry():
        # Fallback vers Python direct si Poetry échoue
        if not run_with_python():
            sys.exit(1)

