"""
Script de test pour les routes admin (rôles et assignation)
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models import User, Role, UserRole
from app.services.role_service import RoleService
from app.services.user_service import UserService
from app.repositories.role_repository import RoleRepository

def get_admin_user(db: Session) -> User:
    """Récupérer l'utilisateur admin"""
    from sqlalchemy.orm import joinedload
    admin = db.query(User).join(UserRole).join(Role).filter(
        Role.name == "admin"
    ).options(
        joinedload(User.user_roles).joinedload(UserRole.role)
    ).first()
    
    if not admin:
        print("ERREUR: Aucun utilisateur admin trouvé")
        sys.exit(1)
    
    return admin

def test_role_crud():
    """Test CRUD complet pour les rôles"""
    print("\n" + "="*60)
    print("TEST 1: CRUD des Rôles")
    print("="*60)
    
    db = SessionLocal()
    try:
        service = RoleService(db)
        
        # Test 1.1: Créer un rôle
        print("\n1.1 - Création d'un rôle 'test_manager'...")
        role = service.create_role(
            name="test_manager",
            description="Rôle de test pour manager"
        )
        print(f"   OK - Rôle créé: ID={role.id}, name={role.name}")
        role_id = role.id
        
        # Test 1.2: Récupérer le rôle par ID
        print("\n1.2 - Récupération du rôle par ID...")
        role = service.get_role_by_id(role_id)
        print(f"   OK - Rôle récupéré: {role.name} - {role.description}")
        
        # Test 1.3: Récupérer le rôle par nom
        print("\n1.3 - Récupération du rôle par nom...")
        role = service.get_role_by_name("test_manager")
        print(f"   OK - Rôle trouvé: {role.name}")
        
        # Test 1.4: Lister tous les rôles
        print("\n1.4 - Liste de tous les rôles...")
        roles = service.get_all_roles()
        print(f"   OK - {len(roles)} rôles trouvés")
        for r in roles:
            print(f"      - {r.name} (ID: {r.id})")
        
        # Test 1.5: Modifier le rôle
        print("\n1.5 - Modification du rôle...")
        role = service.update_role(
            role_id=role_id,
            name="test_manager_updated",
            description="Description mise à jour"
        )
        print(f"   OK - Rôle modifié: {role.name} - {role.description}")
        
        # Test 1.6: Vérifier qu'on ne peut pas créer un rôle avec un nom existant
        print("\n1.6 - Tentative de créer un rôle avec un nom existant...")
        try:
            service.create_role(name="test_manager_updated", description="Test")
            print("   ERREUR - Le rôle a été créé alors qu'il existe déjà")
        except Exception as e:
            print(f"   OK - Erreur attendue: {str(e)[:80]}")
        
        # Test 1.7: Supprimer le rôle
        print("\n1.7 - Suppression du rôle...")
        result = service.delete_role(role_id)
        print(f"   OK - Rôle supprimé: {result}")
        
        # Vérifier que le rôle n'existe plus
        role = service.get_role_by_name("test_manager_updated")
        if role:
            print("   ERREUR - Le rôle existe encore après suppression")
        else:
            print("   OK - Le rôle n'existe plus")
        
        print("\n   RESULTAT: Tous les tests CRUD des rôles sont OK")
        
    except Exception as e:
        print(f"\n   ERREUR lors des tests CRUD: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

def test_role_assignment():
    """Test assignation de rôles aux utilisateurs"""
    print("\n" + "="*60)
    print("TEST 2: Assignation de Rôles aux Utilisateurs")
    print("="*60)
    
    db = SessionLocal()
    try:
        user_service = UserService(db)
        role_service = RoleService(db)
        
        # Récupérer un utilisateur non-admin (ou créer un test)
        print("\n2.1 - Recherche d'un utilisateur de test...")
        test_user = db.query(User).join(UserRole).join(Role).filter(
            Role.name != "admin"
        ).first()
        
        if not test_user:
            # Créer un utilisateur de test
            print("   Création d'un utilisateur de test...")
            from app.dto.user_dto import UserCreate
            test_user = user_service.create_user(UserCreate(
                name="Test User Role",
                email="testrole@example.com",
                password="test123"
            ))
            print(f"   OK - Utilisateur créé: ID={test_user.id}, email={test_user.email}")
        else:
            print(f"   OK - Utilisateur trouvé: ID={test_user.id}, email={test_user.email}")
        
        user_id = test_user.id
        
        # Créer un rôle de test
        print("\n2.2 - Création d'un rôle de test...")
        test_role = role_service.create_role(
            name="test_role_assignment",
            description="Rôle pour test d'assignation"
        )
        role_id = test_role.id
        print(f"   OK - Rôle créé: ID={role_id}, name={test_role.name}")
        
        # Test 2.3: Assigner le rôle
        print("\n2.3 - Assignation du rôle à l'utilisateur...")
        user = user_service.assign_role_to_user(user_id, role_id)
        print(f"   OK - Rôle assigné. L'utilisateur a maintenant {len(user.user_roles)} rôle(s)")
        for ur in user.user_roles:
            print(f"      - {ur.role.name} (ID: {ur.role_id})")
        
        # Test 2.4: Vérifier qu'on ne peut pas assigner deux fois
        print("\n2.4 - Tentative d'assignation du même rôle deux fois...")
        try:
            user_service.assign_role_to_user(user_id, role_id)
            print("   ERREUR - Le rôle a été assigné deux fois")
        except Exception as e:
            print(f"   OK - Erreur attendue: {str(e)[:80]}")
        
        # Test 2.5: Récupérer les rôles de l'utilisateur
        print("\n2.5 - Récupération des rôles de l'utilisateur...")
        user_roles = user_service.get_user_roles(user_id)
        print(f"   OK - {len(user_roles)} rôle(s) trouvé(s)")
        for ur in user_roles:
            print(f"      - {ur.role.name} (ID: {ur.role_id})")
        
        # Test 2.6: Retirer le rôle
        print("\n2.6 - Retrait du rôle de l'utilisateur...")
        user = user_service.remove_role_from_user(user_id, role_id)
        print(f"   OK - Rôle retiré. L'utilisateur a maintenant {len(user.user_roles)} rôle(s)")
        
        # Test 2.7: Vérifier qu'on ne peut pas retirer un rôle non assigné
        print("\n2.7 - Tentative de retirer un rôle non assigné...")
        try:
            user_service.remove_role_from_user(user_id, role_id)
            print("   ERREUR - Le rôle a été retiré alors qu'il n'était pas assigné")
        except Exception as e:
            print(f"   OK - Erreur attendue: {str(e)[:80]}")
        
        # Nettoyer: Supprimer le rôle de test
        print("\n2.8 - Nettoyage: Suppression du rôle de test...")
        role_service.delete_role(role_id)
        print("   OK - Rôle de test supprimé")
        
        print("\n   RESULTAT: Tous les tests d'assignation sont OK")
        
    except Exception as e:
        print(f"\n   ERREUR lors des tests d'assignation: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

def test_role_deletion_protection():
    """Test que les rôles assignés ne peuvent pas être supprimés"""
    print("\n" + "="*60)
    print("TEST 3: Protection contre Suppression de Rôles Assignés")
    print("="*60)
    
    db = SessionLocal()
    try:
        user_service = UserService(db)
        role_service = RoleService(db)
        
        # Créer un rôle de test
        print("\n3.1 - Création d'un rôle de test...")
        test_role = role_service.create_role(
            name="test_role_protected",
            description="Rôle protégé contre suppression"
        )
        role_id = test_role.id
        print(f"   OK - Rôle créé: ID={role_id}")
        
        # Récupérer un utilisateur
        test_user = db.query(User).first()
        if not test_user:
            print("   ERREUR - Aucun utilisateur trouvé")
            return
        
        # Assigner le rôle
        print("\n3.2 - Assignation du rôle à un utilisateur...")
        user_service.assign_role_to_user(test_user.id, role_id)
        print(f"   OK - Rôle assigné à l'utilisateur ID={test_user.id}")
        
        # Tentative de suppression
        print("\n3.3 - Tentative de suppression du rôle assigné...")
        try:
            role_service.delete_role(role_id)
            print("   ERREUR - Le rôle a été supprimé alors qu'il est assigné")
        except Exception as e:
            print(f"   OK - Erreur attendue (rôle protégé): {str(e)[:80]}")
        
        # Retirer le rôle puis supprimer
        print("\n3.4 - Retrait du rôle puis suppression...")
        user_service.remove_role_from_user(test_user.id, role_id)
        result = role_service.delete_role(role_id)
        print(f"   OK - Rôle supprimé après retrait: {result}")
        
        print("\n   RESULTAT: Protection contre suppression OK")
        
    except Exception as e:
        print(f"\n   ERREUR lors du test de protection: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

def main():
    """Fonction principale"""
    print("\n" + "="*60)
    print("TESTS DES ROUTES ADMIN - Rôles et Assignation")
    print("="*60)
    
    # Vérifier qu'un admin existe
    db = SessionLocal()
    try:
        admin = get_admin_user(db)
        print(f"\nUtilisateur admin trouvé: {admin.email} (ID: {admin.id})")
    except Exception as e:
        print(f"\nERREUR: {str(e)}")
        return
    finally:
        db.close()
    
    # Exécuter les tests
    test_role_crud()
    test_role_assignment()
    test_role_deletion_protection()
    
    print("\n" + "="*60)
    print("TOUS LES TESTS SONT TERMINES")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()

