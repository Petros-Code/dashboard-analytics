"""
Script de test complet pour les permissions par section
Exécuter avec: python test_permissions_complete.py
"""
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.section_permission_service import SectionPermissionService
from app.repositories.role_repository import RoleRepository
from app.core.exceptions import NotFoundError, ValidationError


def test_complete():
    """Exécute tous les tests pour les permissions par section"""
    db = next(get_db())
    service = SectionPermissionService(db)
    role_repo = RoleRepository(db)
    
    print("=" * 60)
    print("🧪 TESTS COMPLETS - PERMISSIONS PAR SECTION")
    print("=" * 60)
    
    # 1. Créer ou récupérer un rôle de test
    print("\n1️⃣ Création/Récupération du rôle 'test_role'")
    role = role_repo.get_by_name("test_role")
    if not role:
        role = role_repo.create(name="test_role", description="Rôle de test")
        print(f"   ✅ Rôle créé : ID={role.id}, Name={role.name}")
    else:
        print(f"   ✅ Rôle existant : ID={role.id}, Name={role.name}")
    
    # 2. Créer plusieurs permissions
    print("\n2️⃣ Création de permissions")
    sections = [
        ("dashboard", True, True),
        ("analytics", True, False),
        ("users", False, False),
        ("settings", True, True)
    ]
    
    for section, can_view, can_edit in sections:
        perm = service.set_permission(role.id, section, can_view, can_edit)
        print(f"   ✅ {section}: view={perm.can_view}, edit={perm.can_edit}")
    
    # 3. Vérifier les permissions
    print("\n3️⃣ Vérification des permissions")
    test_cases = [
        ("dashboard", "view", True),
        ("dashboard", "edit", True),
        ("analytics", "view", True),
        ("analytics", "edit", False),
        ("users", "view", False),
        ("users", "edit", False),
        ("settings", "view", True),
        ("settings", "edit", True),
    ]
    
    all_passed = True
    for section, action, expected in test_cases:
        result = service.check_permission(role.id, section, action)
        status = "✅" if result == expected else "❌"
        print(f"   {status} {section}.{action}: {result} (attendu: {expected})")
        if result != expected:
            all_passed = False
    
    # 4. Récupérer toutes les permissions
    print("\n4️⃣ Récupération de toutes les permissions")
    permissions = service.get_all_permissions_for_role(role.id)
    print(f"   ✅ {len(permissions)} permissions trouvées:")
    for perm in permissions:
        print(f"      - {perm.section}: view={perm.can_view}, edit={perm.can_edit}")
    
    # 5. Test de permission inexistante
    print("\n5️⃣ Test permission inexistante")
    result = service.check_permission(role.id, "inexistant", "view")
    assert result == False, "Permission inexistante doit retourner False"
    print("   ✅ Permission inexistante retourne False")
    
    # 6. Test mise à jour
    print("\n6️⃣ Test mise à jour")
    updated = service.set_permission(role.id, "analytics", True, True)
    assert updated.can_edit == True, "Mise à jour échouée"
    print("   ✅ Permission analytics mise à jour: edit=True")
    
    # Vérifier après mise à jour
    has_edit = service.check_permission(role.id, "analytics", "edit")
    assert has_edit == True, "Permission edit non mise à jour"
    print("   ✅ Vérification: permission edit activée")
    
    # 7. Test suppression
    print("\n7️⃣ Test suppression")
    deleted = service.delete_permission(role.id, "users")
    assert deleted == True, "Suppression échouée"
    print("   ✅ Permission 'users' supprimée")
    
    # Vérifier qu'elle n'existe plus
    result = service.check_permission(role.id, "users", "view")
    assert result == False, "Permission supprimée doit retourner False"
    print("   ✅ Vérification: permission supprimée correctement")
    
    # 8. Test erreurs
    print("\n8️⃣ Test gestion d'erreurs")
    
    # Rôle inexistant
    try:
        service.set_permission(99999, "test", True, False)
        print("   ❌ Erreur: NotFoundError non levée")
        all_passed = False
    except NotFoundError:
        print("   ✅ NotFoundError levée pour rôle inexistant")
    
    # Action invalide
    try:
        service.check_permission(role.id, "dashboard", "invalid")
        print("   ❌ Erreur: ValidationError non levée")
        all_passed = False
    except ValidationError:
        print("   ✅ ValidationError levée pour action invalide")
    
    print("\n" + "=" * 60)
    if all_passed:
        print("✅ TOUS LES TESTS SONT PASSÉS !")
    else:
        print("❌ CERTAINS TESTS ONT ÉCHOUÉ")
    print("=" * 60)
    
    return all_passed


if __name__ == "__main__":
    try:
        test_complete()
    except Exception as e:
        print(f"\n❌ ERREUR LORS DES TESTS: {e}")
        import traceback
        traceback.print_exc()

