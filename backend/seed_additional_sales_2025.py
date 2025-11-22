#!/usr/bin/env python3
"""
Script pour générer 350 ventes supplémentaires sur l'année 2025
avec les nouvelles marketplaces et 6 pays européens
Usage: python seed_additional_sales_2025.py
"""
import sys
import random
from datetime import datetime, timedelta
from decimal import Decimal
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models import (
    Country, Marketplace, Category, Product, Customer, Order, OrderItem,
    ImportBatch
)

# 6 pays européens
EUROPEAN_COUNTRIES = [
    {"code": "FR", "name": "France"},
    {"code": "BE", "name": "Belgique"},
    {"code": "ES", "name": "Espagne"},
    {"code": "IT", "name": "Italie"},
    {"code": "DE", "name": "Allemagne"},
    {"code": "NL", "name": "Pays-Bas"},
]

# Nouvelles marketplaces
MARKETPLACES = [
    {"name": "La Redoute", "commission_rate": Decimal("15.00")},
    {"name": "Vinted", "commission_rate": Decimal("5.00")},
    {"name": "Décathlon", "commission_rate": Decimal("10.00")},
    {"name": "Etsy", "commission_rate": Decimal("6.50")},
    {"name": "Ebay", "commission_rate": Decimal("10.00")},
    {"name": "Meduza Store", "commission_rate": Decimal("0.00")},
]

FIRST_NAMES = [
    "Marie", "Sophie", "Julie", "Camille", "Emma", "Léa", "Chloé", "Manon",
    "Thomas", "Pierre", "Lucas", "Antoine", "Nicolas", "Alexandre", "Julien", "Maxime",
    "Anna", "Laura", "Sofia", "Elena", "Giulia", "Francesca", "Marco", "Luca",
    "Maria", "Carmen", "Diego", "Carlos", "Hans", "Klaus", "Anna", "Sophie"
]

LAST_NAMES = [
    "Martin", "Bernard", "Dubois", "Thomas", "Robert", "Richard", "Petit", "Durand",
    "Leroy", "Moreau", "Simon", "Laurent", "Lefebvre", "Michel", "Garcia", "David",
    "Rossi", "Ferrari", "Esposito", "Bianchi", "Romano", "Colombo", "Ricci", "Marino",
    "Garcia", "Rodriguez", "Lopez", "Martinez", "Muller", "Schmidt", "Schneider", "Fischer"
]

PRODUCT_NAMES = {
    "Hauts": ["T-shirt vintage", "Chemise blanche", "Pull en laine", "Sweat-shirt", "Blouse élégante"],
    "Pantalons": ["Jean slim", "Pantalon chino", "Legging", "Pantalon cargo", "Jogging"],
    "Robes": ["Robe d'été", "Robe de soirée", "Robe midi", "Robe longue", "Robe courte"],
    "Vestes": ["Blouson en cuir", "Veste en jean", "Doudoune", "Trench", "Veste en laine"],
    "Accessoires": ["Écharpe", "Gants", "Bonnet", "Ceinture", "Foulard"],
    "Baskets": ["Baskets blanches", "Baskets colorées", "Baskets vintage", "Baskets de sport"],
    "Bottes": ["Bottes en cuir", "Bottes de pluie", "Bottes d'hiver", "Bottes à talons"],
    "Escarpins": ["Escarpins noirs", "Escarpins rouges", "Escarpins nus", "Escarpins à talons"],
    "Sandales": ["Sandales plates", "Sandales à talons", "Sandales de plage", "Sandales élégantes"],
    "Sacs à main": ["Sac à main cuir", "Sac à main vintage", "Sac à main designer", "Sac à main classique"],
    "Sacs à dos": ["Sac à dos vintage", "Sac à dos de sport", "Sac à dos cuir", "Sac à dos casual"],
    "Pochette": ["Pochette soirée", "Pochette élégante", "Pochette vintage", "Pochette moderne"],
    "Tote bag": ["Tote bag coton", "Tote bag cuir", "Tote bag canvas", "Tote bag designer"],
    "Colliers": ["Collier doré", "Collier argenté", "Collier perles", "Collier pendentif"],
    "Bracelets": ["Bracelet cuir", "Bracelet métal", "Bracelet perles", "Bracelet chaîne"],
    "Boucles d'oreilles": ["Boucles d'oreilles dorées", "Boucles d'oreilles argentées", "Boucles d'oreilles perles"],
    "Montres": ["Montre vintage", "Montre moderne", "Montre de sport", "Montre élégante"],
}

ORDER_STATUSES = ["pending", "completed", "completed", "completed", "completed", "cancelled"]


def get_or_create_countries(db: Session) -> dict[str, Country]:
    """Crée ou récupère les pays européens"""
    countries = {}
    for country_data in EUROPEAN_COUNTRIES:
        country = db.query(Country).filter(Country.code == country_data["code"]).first()
        if not country:
            country = Country(**country_data)
            db.add(country)
            db.commit()
            db.refresh(country)
        countries[country_data["code"]] = country
    return countries


def get_marketplaces(db: Session) -> dict[str, Marketplace]:
    """Récupère les marketplaces"""
    marketplaces = {}
    for marketplace_data in MARKETPLACES:
        marketplace = db.query(Marketplace).filter(Marketplace.name == marketplace_data["name"]).first()
        if marketplace:
            marketplaces[marketplace_data["name"]] = marketplace
    return marketplaces


def get_categories_and_subcategories(db: Session) -> tuple[dict, dict]:
    """Récupère les catégories et sous-catégories"""
    categories = {}
    subcategories = {}
    
    all_categories = db.query(Category).all()
    for cat in all_categories:
        if cat.level == 1:
            categories[cat.name] = cat
        elif cat.level == 2:
            subcategories[cat.name] = cat
    
    return categories, subcategories


def get_existing_products(db: Session, limit: int = 100) -> list[Product]:
    """Récupère les produits existants"""
    return db.query(Product).limit(limit).all()


def create_additional_customers(db: Session, count: int = 100) -> list[Customer]:
    """Crée des clients supplémentaires"""
    customers = []
    emails_used = set()
    
    # Récupérer les emails existants
    existing_emails = {c.email for c in db.query(Customer).all()}
    emails_used.update(existing_emails)
    
    for i in range(count):
        first_name = random.choice(FIRST_NAMES)
        last_name = random.choice(LAST_NAMES)
        
        email_base = f"{first_name.lower()}.{last_name.lower()}"
        email_num = 1
        email = f"{email_base}@example.com"
        while email in emails_used:
            email = f"{email_base}{email_num}@example.com"
            email_num += 1
        emails_used.add(email)
        
        customer = Customer(
            email=email,
            first_name=first_name,
            last_name=last_name,
            first_order_date=None,
            last_order_date=None,
        )
        db.add(customer)
        customers.append(customer)
    
    db.commit()
    for customer in customers:
        db.refresh(customer)
    
    return customers


def create_orders_2025(
    db: Session,
    customers: list[Customer],
    products: list[Product],
    marketplaces: dict[str, Marketplace],
    countries: dict[str, Country],
    num_orders: int = 350
) -> list[Order]:
    """Crée des commandes pour l'année 2025"""
    orders = []
    
    # Période : toute l'année 2025
    start_date = datetime(2025, 1, 1)
    end_date = datetime(2025, 12, 31)
    total_days = (end_date - start_date).days
    
    # Créer un batch d'import
    import_batch = ImportBatch(
        batch_number=f"BATCH-2025-{datetime.now().strftime('%Y%m%d-%H%M%S')}",
        import_date=datetime.now(),
        records_imported=0,
        status="success",
        notes="Import de 350 ventes supplémentaires pour l'année 2025"
    )
    db.add(import_batch)
    db.commit()
    db.refresh(import_batch)
    
    for i in range(num_orders):
        # Date de commande aléatoire dans l'année 2025
        days_ago = random.randint(0, total_days)
        order_date = start_date + timedelta(days=days_ago)
        
        # Choisir un client aléatoire
        customer = random.choice(customers)
        
        # Choisir une marketplace aléatoire
        marketplace = random.choice(list(marketplaces.values()))
        
        # Choisir un pays européen aléatoire
        country = random.choice(list(countries.values()))
        
        # Générer un numéro de commande unique
        order_number = f"ORD-2025-{order_date.strftime('%Y%m%d')}-{i+1:05d}"
        
        # Choisir des produits pour cette commande (1 à 3 produits)
        num_items = random.randint(1, 3)
        order_products = random.sample(products, min(num_items, len(products)))
        
        # Calculer les totaux
        subtotal_ht = Decimal("0.00")
        subtotal_ttc = Decimal("0.00")
        order_items_list = []
        
        for product in order_products:
            quantity = random.randint(1, 2)
            unit_price_ht = product.selling_price_ht
            unit_price_ttc = product.selling_price_ttc
            total_price_ht = Decimal(str(round(float(unit_price_ht) * quantity, 2)))
            total_price_ttc = Decimal(str(round(float(unit_price_ttc) * quantity, 2)))
            
            subtotal_ht += total_price_ht
            subtotal_ttc += total_price_ttc
            
            # Calculer la commission marketplace
            commission_rate = marketplace.commission_rate or Decimal("0.00")
            marketplace_commission = Decimal(str(round(float(total_price_ht) * float(commission_rate) / 100, 2)))
            
            # Calculer les marges
            cost_price = product.purchase_price or Decimal("0.00")
            gross_margin = total_price_ht - (cost_price * quantity)
            
            # Coûts additionnels
            packaging_cost = Decimal(str(round(random.uniform(0.50, 2.00), 2)))
            washing_cost = Decimal(str(round(random.uniform(0, 3.00), 2))) if random.random() > 0.7 else Decimal("0.00")
            other_costs = Decimal(str(round(random.uniform(0, 1.00), 2)))
            
            # Marge nette calculée
            calculated_net_margin = gross_margin - marketplace_commission - packaging_cost - washing_cost - other_costs
            
            order_item = OrderItem(
                product_id=product.id,
                product_name=product.name,
                quantity=quantity,
                unit_price_ht=unit_price_ht,
                unit_price_ttc=unit_price_ttc,
                total_price_ht=total_price_ht,
                total_price_ttc=total_price_ttc,
                cost_price=cost_price,
                gross_margin=gross_margin,
                net_margin=gross_margin,
                packaging_cost=packaging_cost,
                washing_cost=washing_cost,
                marketplace_commission=marketplace_commission,
                other_costs=other_costs,
                calculated_net_margin=calculated_net_margin,
            )
            order_items_list.append(order_item)
        
        # Réduction occasionnelle (10% des commandes)
        discount_amount = Decimal("0.00")
        if random.random() < 0.1:
            discount_percent = random.choice([5, 10, 15])
            discount_amount = Decimal(str(round(float(subtotal_ht) * discount_percent / 100, 2)))
        
        # Taxes (TVA 20%)
        tax_amount = Decimal(str(round(float(subtotal_ht - discount_amount) * 0.20, 2)))
        
        # Totaux finaux
        total_ht = subtotal_ht - discount_amount
        total_ttc = subtotal_ttc - discount_amount + tax_amount
        
        # Statut de la commande
        status = random.choice(ORDER_STATUSES)
        is_cancelled = status == "cancelled"
        is_refunded = status == "refunded"
        has_returns = random.random() < 0.05
        
        order = Order(
            order_number=order_number,
            customer_id=customer.id,
            marketplace_id=marketplace.id,
            country_id=country.id,
            order_date=order_date,
            subtotal_ht=subtotal_ht,
            discount_amount=discount_amount,
            tax_amount=tax_amount,
            total_ht=total_ht,
            total_ttc=total_ttc,
            status=status,
            has_returns=has_returns,
            is_refunded=is_refunded,
            is_cancelled=is_cancelled,
            import_batch_id=import_batch.id,
        )
        
        db.add(order)
        db.flush()
        
        # Ajouter les order_items
        for item in order_items_list:
            item.order_id = order.id
            db.add(item)
        
        orders.append(order)
        
        # Mettre à jour les dates du client
        if customer.first_order_date is None or order_date < customer.first_order_date:
            customer.first_order_date = order_date
        if customer.last_order_date is None or order_date > customer.last_order_date:
            customer.last_order_date = order_date
    
    db.commit()
    for order in orders:
        db.refresh(order)
    
    # Mettre à jour le batch d'import
    import_batch.records_imported = len(orders)
    db.commit()
    
    return orders


def main():
    db = SessionLocal()
    
    try:
        print("=" * 60)
        print("GENERATION DE 350 VENTES SUPPLEMENTAIRES POUR 2025")
        print("=" * 60)
        
        # 1. Récupérer ou créer les pays européens
        print("\n[1/5] Recuperation/creation des pays europeens...")
        countries = get_or_create_countries(db)
        print(f"  [OK] {len(countries)} pays europeens disponibles")
        for code, country in countries.items():
            print(f"     - {country.name} ({code})")
        
        # 2. Récupérer les marketplaces
        print("\n[2/5] Recuperation des marketplaces...")
        marketplaces = get_marketplaces(db)
        print(f"  [OK] {len(marketplaces)} marketplaces disponibles")
        for name, marketplace in marketplaces.items():
            print(f"     - {name} (Commission: {marketplace.commission_rate}%)")
        
        if len(marketplaces) == 0:
            print("\n[ERREUR] Aucune marketplace trouvee. Executez d'abord update_marketplaces.py")
            sys.exit(1)
        
        # 3. Récupérer les catégories et produits
        print("\n[3/5] Recuperation des produits existants...")
        products = get_existing_products(db, limit=100)
        print(f"  [OK] {len(products)} produits disponibles")
        
        if len(products) == 0:
            print("\n[ERREUR] Aucun produit trouve. Executez d'abord seed_sales_data.py avec --products")
            sys.exit(1)
        
        # 4. Créer des clients supplémentaires
        print("\n[4/5] Creation de 100 clients supplementaires...")
        customers = create_additional_customers(db, count=100)
        print(f"  [OK] {len(customers)} clients crees")
        
        # 5. Créer les commandes pour 2025
        print("\n[5/5] Creation de 350 commandes pour l'annee 2025...")
        orders = create_orders_2025(
            db, customers, products, marketplaces, countries, num_orders=350
        )
        print(f"  [OK] {len(orders)} commandes crees")
        
        # Statistiques
        print("\n" + "=" * 60)
        print("STATISTIQUES")
        print("=" * 60)
        
        completed_orders = [o for o in orders if o.status == "completed"]
        total_revenue = sum(float(o.total_ttc) for o in completed_orders)
        
        print(f"   - Commandes completees: {len(completed_orders)}")
        print(f"   - Chiffre d'affaires total: {total_revenue:.2f} EUR")
        print(f"   - Panier moyen: {total_revenue / len(completed_orders):.2f} EUR" if completed_orders else "   - Panier moyen: 0.00 EUR")
        
        # Répartition par marketplace
        print("\n   Repartition par marketplace:")
        for marketplace_name, marketplace in marketplaces.items():
            marketplace_orders = [o for o in orders if o.marketplace_id == marketplace.id]
            marketplace_revenue = sum(float(o.total_ttc) for o in marketplace_orders if o.status == "completed")
            print(f"     - {marketplace_name}: {len(marketplace_orders)} commandes ({marketplace_revenue:.2f} EUR)")
        
        # Répartition par pays
        print("\n   Repartition par pays:")
        for country_code, country in countries.items():
            country_orders = [o for o in orders if o.country_id == country.id]
            country_revenue = sum(float(o.total_ttc) for o in country_orders if o.status == "completed")
            print(f"     - {country.name} ({country_code}): {len(country_orders)} commandes ({country_revenue:.2f} EUR)")
        
        # Répartition mensuelle
        print("\n   Repartition mensuelle (2025):")
        months = {}
        for order in completed_orders:
            month_key = order.order_date.strftime('%Y-%m')
            if month_key not in months:
                months[month_key] = 0
            months[month_key] += 1
        
        for month in sorted(months.keys()):
            month_name = datetime.strptime(month, '%Y-%m').strftime('%B %Y')
            print(f"     - {month_name}: {months[month]} commandes")
        
        print("\n" + "=" * 60)
        print("[OK] Generation terminee avec succes!")
        print("=" * 60)
        
    except Exception as e:
        db.rollback()
        print(f"\n[ERREUR] {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()

