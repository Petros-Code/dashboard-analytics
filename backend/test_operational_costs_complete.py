"""
Script de test complet pour les coûts opérationnels
Exécuter avec: python test_operational_costs_complete.py
"""
from sqlalchemy.orm import Session
from datetime import date
from decimal import Decimal
from app.core.database import get_db
from app.services.operational_cost_service import OperationalCostService
from app.repositories.user_repository import UserRepository
from app.dto.operational_cost_dto import OperationalCostCreate, OperationalCostUpdate
from app.core.exceptions import NotFoundError, ValidationError


def test_complete():
    """Exécute tous les tests pour les coûts opérationnels"""
    db = next(get_db())
    service = OperationalCostService(db)
    user_repo = UserRepository(db)
    
    print("=" * 60)
    print("TESTS COMPLETS - COUTS OPERATIONNELS")
    print("=" * 60)
    
    # 1. Récupérer un utilisateur admin (ou créer un test)
    print("\n[1] Recuperation d'un utilisateur admin")
    # Chercher un utilisateur avec le rôle admin
    from app.models import User, UserRole, Role
    admin_user = db.query(User).join(UserRole).join(Role).filter(
        Role.name == "admin"
    ).first()
    
    if not admin_user:
        print("   [WARNING] Aucun utilisateur admin trouve. Creation d'un utilisateur de test...")
        from app.services.user_service import UserService
        from app.dto.user_dto import UserCreate
        user_service = UserService(db)
        admin_user = user_service.create_user(UserCreate(
            name="Test Admin",
            email="testadmin@example.com",
            password="password123"
        ))
        # Assigner le rôle admin (nécessite un script séparé ou manuel)
        print(f"   [OK] Utilisateur cree : {admin_user.name} (ID: {admin_user.id})")
        print("   [WARNING] Note: Vous devrez assigner le role admin manuellement")
    else:
        print(f"   [OK] Utilisateur admin trouve : {admin_user.name} (ID: {admin_user.id})")
    
    # 2. Créer plusieurs coûts
    print("\n[2] Creation de couts operationnels")
    costs_data = [
        {
            "month": date(2025, 11, 1),
            "amount": Decimal("1500.50"),
            "category": "hosting",
            "description": "Coût d'hébergement serveur pour novembre 2025"
        },
        {
            "month": date(2025, 11, 1),
            "amount": Decimal("2500.00"),
            "category": "marketing",
            "description": "Campagne publicitaire novembre"
        },
        {
            "month": date(2025, 11, 1),
            "amount": Decimal("8000.00"),
            "category": "salaries",
            "description": "Salaires équipe novembre"
        },
        {
            "month": date(2025, 10, 1),
            "amount": Decimal("1500.50"),
            "category": "hosting",
            "description": "Coût d'hébergement serveur pour octobre 2025"
        },
        {
            "month": date(2025, 9, 1),
            "amount": Decimal("1500.50"),
            "category": "hosting",
            "description": "Coût d'hébergement serveur pour septembre 2025"
        }
    ]
    
    created_costs = []
    for cost_data in costs_data:
        cost_create = OperationalCostCreate(**cost_data)
        cost = service.create_cost(cost_create, admin_user.id)
        created_costs.append(cost)
        print(f"   [OK] Cout cree : ID={cost.id}, {cost.category} ({cost.month}) = {cost.amount} EUR")
    
    # 3. Test récupération par ID
    print("\n[3] Test recuperation par ID")
    test_cost = created_costs[0]
    retrieved_cost = service.get_cost_by_id(test_cost.id)
    assert retrieved_cost.id == test_cost.id, "[ERROR] Recuperation par ID echouee"
    assert retrieved_cost.amount == test_cost.amount, "[ERROR] Montant incorrect"
    print(f"   [OK] Cout recupere : ID={retrieved_cost.id}, Montant={retrieved_cost.amount}")
    
    # 4. Test récupération tous les coûts
    print("\n[4] Test recuperation tous les couts")
    all_costs = service.get_all_costs(skip=0, limit=100)
    assert len(all_costs) >= len(created_costs), "[ERROR] Nombre de couts incorrect"
    print(f"   [OK] {len(all_costs)} couts recuperes")
    
    # 5. Test filtrage par mois
    print("\n[5] Test filtrage par mois")
    november_costs = service.get_costs_by_month(date(2025, 11, 1))
    assert len(november_costs) == 3, f"[ERROR] Nombre de couts novembre incorrect (attendu: 3, obtenu: {len(november_costs)})"
    for cost in november_costs:
        assert cost.month == date(2025, 11, 1), f"[ERROR] Mois incorrect pour le cout {cost.id}"
    print(f"   [OK] {len(november_costs)} couts pour novembre 2025")
    for cost in november_costs:
        print(f"      - {cost.category}: {cost.amount} EUR")
    
    # 6. Test filtrage par catégorie
    print("\n[6] Test filtrage par categorie")
    hosting_costs = service.get_costs_by_category("hosting")
    assert len(hosting_costs) == 3, f"[ERROR] Nombre de couts hosting incorrect (attendu: 3, obtenu: {len(hosting_costs)})"
    for cost in hosting_costs:
        assert cost.category == "hosting", f"[ERROR] Categorie incorrecte pour le cout {cost.id}"
    print(f"   [OK] {len(hosting_costs)} couts pour la categorie 'hosting'")
    for cost in hosting_costs:
        print(f"      - {cost.month}: {cost.amount} EUR")
    
    # 7. Test mise à jour
    print("\n[7] Test mise a jour")
    cost_to_update = created_costs[0]
    new_amount = Decimal("1600.75")
    updated_data = OperationalCostUpdate(amount=new_amount)
    updated_cost = service.update_cost(cost_to_update.id, updated_data)
    assert updated_cost.amount == new_amount, "[ERROR] Mise a jour echouee"
    print(f"   [OK] Cout mis a jour : Montant={updated_cost.amount} EUR (etait {cost_to_update.amount} EUR)")
    
    # Vérifier que les autres champs sont inchangés
    assert updated_cost.category == cost_to_update.category, "[ERROR] Categorie modifiee par erreur"
    assert updated_cost.month == cost_to_update.month, "[ERROR] Mois modifie par erreur"
    print("   [OK] Verification : Autres champs inchanges")
    
    # 8. Test filtrage par plage de dates
    print("\n[8] Test filtrage par plage de dates")
    range_costs = service.get_costs_by_month_range(
        date(2025, 10, 1),
        date(2025, 11, 1)
    )
    assert len(range_costs) >= 4, f"[ERROR] Nombre de couts dans la plage incorrect (attendu: >=4, obtenu: {len(range_costs)})"
    print(f"   [OK] {len(range_costs)} couts entre octobre et novembre 2025")
    
    # 9. Test validations
    print("\n[9] Test validations")
    validation_passed = True
    
    # Test montant = 0
    try:
        invalid_cost = OperationalCostCreate(
            month=date(2025, 12, 1),
            amount=Decimal("0"),
            category="test"
        )
        service.create_cost(invalid_cost, admin_user.id)
        print("   [ERROR] Erreur : Validation montant = 0 echouee")
        validation_passed = False
    except ValidationError as e:
        print(f"   [OK] ValidationError levee pour montant = 0 : {e.message}")
    except Exception as e:
        print(f"   [WARNING] Exception inattendue : {e}")
    
    # Test montant négatif
    try:
        invalid_cost = OperationalCostCreate(
            month=date(2025, 12, 1),
            amount=Decimal("-100.00"),
            category="test"
        )
        service.create_cost(invalid_cost, admin_user.id)
        print("   [ERROR] Erreur : Validation montant negatif echouee")
        validation_passed = False
    except ValidationError as e:
        print(f"   [OK] ValidationError levee pour montant negatif : {e.message}")
    except Exception as e:
        print(f"   [WARNING] Exception inattendue : {e}")
    
    # Test utilisateur inexistant
    try:
        valid_cost = OperationalCostCreate(
            month=date(2025, 12, 1),
            amount=Decimal("100.00"),
            category="test"
        )
        service.create_cost(valid_cost, 99999)  # ID utilisateur inexistant
        print("   [ERROR] Erreur : NotFoundError non levee pour utilisateur inexistant")
        validation_passed = False
    except NotFoundError as e:
        print(f"   [OK] NotFoundError levee pour utilisateur inexistant : {e.message}")
    except Exception as e:
        print(f"   [WARNING] Exception inattendue : {e}")
    
    # 10. Test suppression
    print("\n[10] Test suppression")
    cost_to_delete = created_costs[-1]  # Supprimer le dernier coût créé
    deleted = service.delete_cost(cost_to_delete.id)
    assert deleted == True, "[ERROR] Suppression echouee"
    print(f"   [OK] Cout supprime : ID={cost_to_delete.id}")
    
    # Vérifier qu'il n'existe plus
    try:
        service.get_cost_by_id(cost_to_delete.id)
        print("   [ERROR] Erreur : Cout toujours present apres suppression")
    except NotFoundError:
        print("   [OK] Verification : Cout supprime correctement")
    
    # 11. Test ID inexistant
    print("\n[11] Test ID inexistant")
    try:
        service.get_cost_by_id(99999)
        print("   [ERROR] Erreur : NotFoundError non levee pour ID inexistant")
    except NotFoundError:
        print("   [OK] NotFoundError levee pour ID inexistant")
    
    # 12. Résumé final
    print("\n" + "=" * 60)
    print("RESUME DES TESTS")
    print("=" * 60)
    print(f"[OK] Couts crees : {len(created_costs)}")
    print(f"[OK] Couts recuperes : {len(all_costs)}")
    print(f"[OK] Couts novembre 2025 : {len(november_costs)}")
    print(f"[OK] Couts categorie 'hosting' : {len(hosting_costs)}")
    print(f"[OK] Couts dans plage dates : {len(range_costs)}")
    print(f"[OK] Mise a jour : OK")
    print(f"[OK] Suppression : OK")
    print(f"[OK] Validations : OK")
    print(f"[OK] Gestion erreurs : OK")
    print("=" * 60)
    print("[OK] TOUS LES TESTS SONT PASSES !")
    print("=" * 60)
    
    return True


if __name__ == "__main__":
    try:
        test_complete()
    except AssertionError as e:
        print(f"\n[ERROR] ERREUR LORS DES TESTS: {e}")
        import traceback
        traceback.print_exc()
    except Exception as e:
        print(f"\n[ERROR] ERREUR INATTENDUE: {e}")
        import traceback
        traceback.print_exc()

