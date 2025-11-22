#!/usr/bin/env python3
"""
Script pour mettre à jour les marketplaces dans la base de données
Usage: python update_marketplaces.py
"""
import sys
from sqlalchemy.orm import Session
from decimal import Decimal
from app.core.database import SessionLocal
from app.models import Marketplace

# Nouvelles marketplaces avec leurs taux de commission
NEW_MARKETPLACES = [
    {"name": "La Redoute", "commission_rate": Decimal("15.00")},
    {"name": "Vinted", "commission_rate": Decimal("5.00")},
    {"name": "Décathlon", "commission_rate": Decimal("10.00")},
    {"name": "Etsy", "commission_rate": Decimal("6.50")},
    {"name": "Ebay", "commission_rate": Decimal("10.00")},
    {"name": "Meduza Store", "commission_rate": Decimal("0.00")},  # Marketplace privée
]


def update_marketplaces():
    """Met à jour les marketplaces dans la base de données"""
    db = SessionLocal()
    
    try:
        print("=" * 60)
        print("MISE A JOUR DES MARKETPLACES")
        print("=" * 60)
        
        # Récupérer toutes les marketplaces existantes
        existing_marketplaces = {m.name: m for m in db.query(Marketplace).all()}
        
        print(f"\nMarketplaces existantes: {len(existing_marketplaces)}")
        for name, marketplace in existing_marketplaces.items():
            print(f"  - {name} (ID: {marketplace.id}, Commission: {marketplace.commission_rate}%)")
        
        # Mettre à jour ou créer les nouvelles marketplaces
        print(f"\nMise a jour des marketplaces...")
        updated_count = 0
        created_count = 0
        
        for marketplace_data in NEW_MARKETPLACES:
            name = marketplace_data["name"]
            commission_rate = marketplace_data["commission_rate"]
            
            if name in existing_marketplaces:
                # Mettre à jour la marketplace existante
                marketplace = existing_marketplaces[name]
                old_rate = marketplace.commission_rate
                marketplace.commission_rate = commission_rate
                db.commit()
                db.refresh(marketplace)
                print(f"  [UPDATE] {name}: Commission {old_rate}% -> {commission_rate}%")
                updated_count += 1
            else:
                # Créer une nouvelle marketplace
                marketplace = Marketplace(**marketplace_data)
                db.add(marketplace)
                db.commit()
                db.refresh(marketplace)
                print(f"  [CREATE] {name}: Commission {commission_rate}%")
                created_count += 1
        
        # Mapping pour migrer les anciennes marketplaces vers les nouvelles
        MIGRATION_MAP = {
            "Vestiaire Collective": "Meduza Store",  # Marketplace privée
            "Depop": "Ebay",  # Marketplace similaire
            "Marketplace Privé": "Meduza Store",  # Marketplace privée
            "eBay": "Ebay",  # Correction du nom
        }
        
        # Supprimer les marketplaces qui ne sont plus dans la liste
        new_marketplace_names = {m["name"] for m in NEW_MARKETPLACES}
        deleted_count = 0
        
        print(f"\nMigration et suppression des anciennes marketplaces...")
        from app.models import Order
        
        for name, marketplace in existing_marketplaces.items():
            if name not in new_marketplace_names:
                orders_count = db.query(Order).filter(Order.marketplace_id == marketplace.id).count()
                
                if orders_count > 0:
                    # Migrer vers une nouvelle marketplace si un mapping existe
                    if name in MIGRATION_MAP:
                        target_name = MIGRATION_MAP[name]
                        target_marketplace = db.query(Marketplace).filter(Marketplace.name == target_name).first()
                        
                        if target_marketplace:
                            print(f"  [MIGRATION] {name} -> {target_name}: {orders_count} commandes")
                            db.query(Order).filter(Order.marketplace_id == marketplace.id).update(
                                {Order.marketplace_id: target_marketplace.id}
                            )
                            db.commit()
                            db.delete(marketplace)
                            db.commit()
                            print(f"  [DELETE] {name}")
                            deleted_count += 1
                        else:
                            print(f"  [SKIP] {name}: Marketplace cible '{target_name}' non trouvee")
                    else:
                        # Pas de mapping, migrer vers Meduza Store par défaut
                        meduza = db.query(Marketplace).filter(Marketplace.name == "Meduza Store").first()
                        if meduza:
                            print(f"  [MIGRATION] {name} -> Meduza Store: {orders_count} commandes")
                            db.query(Order).filter(Order.marketplace_id == marketplace.id).update(
                                {Order.marketplace_id: meduza.id}
                            )
                            db.commit()
                            db.delete(marketplace)
                            db.commit()
                            print(f"  [DELETE] {name}")
                            deleted_count += 1
                else:
                    db.delete(marketplace)
                    db.commit()
                    print(f"  [DELETE] {name}")
                    deleted_count += 1
        
        print(f"\n" + "=" * 60)
        print("RESUME")
        print("=" * 60)
        print(f"  - Marketplaces mises a jour: {updated_count}")
        print(f"  - Marketplaces creees: {created_count}")
        print(f"  - Total marketplaces: {len(NEW_MARKETPLACES)}")
        
        # Afficher la liste finale
        print(f"\nMarketplaces finales:")
        final_marketplaces = db.query(Marketplace).order_by(Marketplace.name).all()
        for marketplace in final_marketplaces:
            print(f"  - {marketplace.name} (ID: {marketplace.id}, Commission: {marketplace.commission_rate}%)")
        
        print("\n[OK] Mise a jour terminee avec succes!")
        
    except Exception as e:
        db.rollback()
        print(f"\n[ERREUR] {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    update_marketplaces()

