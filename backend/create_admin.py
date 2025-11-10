#!/usr/bin/env python3
"""
Script pour créer un utilisateur administrateur

Usage:
    python create_admin.py
    python create_admin.py --name "Admin User" --email "admin@example.com" --password "admin123"
    python create_admin.py -n "Admin" -e "admin@test.com" -p "securepass"
"""
import sys
import argparse
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models import User, Role, UserRole
from app.services.user_service import UserService
from app.dto.user_dto import UserCreate
from app.core.exceptions import ConflictError


def get_or_create_admin_role(db: Session) -> Role:
    """
    Récupère le rôle admin s'il existe, sinon le crée
    
    Args:
        db: Database session
    
    Returns:
        Role object with name "admin"
    """
    # Chercher le rôle admin
    admin_role = db.query(Role).filter(Role.name.ilike("admin")).first()
    
    if admin_role:
        print(f"✓ Rôle 'admin' trouvé (ID: {admin_role.id})")
        return admin_role
    
    # Créer le rôle admin s'il n'existe pas
    admin_role = Role(
        name="admin",
        description="Administrateur avec tous les droits"
    )
    db.add(admin_role)
    db.commit()
    db.refresh(admin_role)
    print(f"✓ Rôle 'admin' créé (ID: {admin_role.id})")
    return admin_role


def create_admin_user(
    name: str,
    email: str,
    password: str,
    is_active: bool = True,
    is_verified: bool = True
) -> User:
    """
    Crée un utilisateur administrateur
    
    Args:
        name: Nom de l'utilisateur
        email: Email de l'utilisateur
        password: Mot de passe (sera hashé)
        is_active: Compte actif (default: True)
        is_verified: Compte vérifié (default: True)
    
    Returns:
        User object avec le rôle admin assigné
    """
    db: Session = SessionLocal()
    
    try:
        # Vérifier si l'utilisateur existe déjà
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            print(f"⚠️  L'utilisateur avec l'email '{email}' existe déjà (ID: {existing_user.id})")
            response = input("Voulez-vous lui assigner le rôle admin ? (o/n): ").lower()
            if response == 'o':
                user = existing_user
            else:
                print("❌ Opération annulée")
                sys.exit(1)
        else:
            # Créer l'utilisateur
            user_service = UserService(db)
            user_create = UserCreate(name=name, email=email, password=password)
            user = user_service.create_user(user_create)
            
            # Mettre à jour is_active et is_verified
            user.is_active = is_active
            user.is_verified = is_verified
            db.commit()
            db.refresh(user)
            print(f"✓ Utilisateur créé (ID: {user.id})")
        
        # Récupérer ou créer le rôle admin
        admin_role = get_or_create_admin_role(db)
        
        # Vérifier si l'utilisateur a déjà le rôle admin
        existing_user_role = db.query(UserRole).filter(
            UserRole.user_id == user.id,
            UserRole.role_id == admin_role.id
        ).first()
        
        if existing_user_role:
            print(f"⚠️  L'utilisateur a déjà le rôle admin")
        else:
            # Assigner le rôle admin
            user_role = UserRole(
                user_id=user.id,
                role_id=admin_role.id
            )
            db.add(user_role)
            db.commit()
            print(f"✓ Rôle admin assigné à l'utilisateur")
        
        # Recharger l'utilisateur avec les relations
        db.refresh(user)
        
        print("\n" + "=" * 60)
        print("✅ Utilisateur admin créé avec succès !")
        print("=" * 60)
        print(f"ID: {user.id}")
        print(f"Nom: {user.name}")
        print(f"Email: {user.email}")
        print(f"Actif: {user.is_active}")
        print(f"Vérifié: {user.is_verified}")
        print(f"Rôles: {[ur.role.name for ur in user.user_roles]}")
        print("=" * 60)
        
        return user
        
    except ConflictError as e:
        print(f"❌ Erreur: {e.message}")
        db.rollback()
        sys.exit(1)
    except Exception as e:
        print(f"❌ Erreur inattendue: {str(e)}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()


def main():
    """Point d'entrée principal du script"""
    parser = argparse.ArgumentParser(
        description="Créer un utilisateur administrateur",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemples:
  python create_admin.py
  python create_admin.py --name "Admin User" --email "admin@example.com" --password "admin123"
  python create_admin.py -n "Admin" -e "admin@test.com" -p "securepass" --no-verified
        """
    )
    
    parser.add_argument(
        "-n", "--name",
        type=str,
        default="Administrator",
        help="Nom de l'utilisateur (default: Administrator)"
    )
    
    parser.add_argument(
        "-e", "--email",
        type=str,
        default="admin@dashboard.com",
        help="Email de l'utilisateur (default: admin@dashboard.com)"
    )
    
    parser.add_argument(
        "-p", "--password",
        type=str,
        default="admin123",
        help="Mot de passe (default: admin123)"
    )
    
    parser.add_argument(
        "--no-active",
        action="store_true",
        help="Créer le compte comme inactif (default: actif)"
    )
    
    parser.add_argument(
        "--no-verified",
        action="store_true",
        help="Créer le compte comme non vérifié (default: vérifié)"
    )
    
    args = parser.parse_args()
    
    print("=" * 60)
    print("Création d'un utilisateur administrateur")
    print("=" * 60)
    print(f"Nom: {args.name}")
    print(f"Email: {args.email}")
    print(f"Mot de passe: {'*' * len(args.password)}")
    print(f"Actif: {not args.no_active}")
    print(f"Vérifié: {not args.no_verified}")
    print("=" * 60)
    
    create_admin_user(
        name=args.name,
        email=args.email,
        password=args.password,
        is_active=not args.no_active,
        is_verified=not args.no_verified
    )


if __name__ == "__main__":
    main()

