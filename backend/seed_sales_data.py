#!/usr/bin/env python3
"""
Script pour remplir la base de données avec des ventes fictives
Usage: python seed_sales_data.py [--orders N] [--months M]
"""
import sys
import argparse
from datetime import datetime, timedelta
from decimal import Decimal
import random
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models import (
    Country, Marketplace, Category, Product, Customer, Order, OrderItem,
    ProductMarketplace, ImportBatch
)

# Données de base pour générer les ventes fictives

# 6 pays européens pour les nouvelles ventes
EUROPEAN_COUNTRIES_DATA = [
    {"code": "FR", "name": "France"},
    {"code": "BE", "name": "Belgique"},
    {"code": "ES", "name": "Espagne"},
    {"code": "IT", "name": "Italie"},
    {"code": "DE", "name": "Allemagne"},
    {"code": "NL", "name": "Pays-Bas"},
]

# Tous les pays (pour compatibilité avec le reste du script)
COUNTRIES_DATA = EUROPEAN_COUNTRIES_DATA + [
    {"code": "CH", "name": "Suisse"},
    {"code": "GB", "name": "Royaume-Uni"},
    {"code": "US", "name": "États-Unis"},
    {"code": "CA", "name": "Canada"},
]

MARKETPLACES_DATA = [
    {"name": "La Redoute", "commission_rate": Decimal("15.00")},
    {"name": "Vinted", "commission_rate": Decimal("5.00")},
    {"name": "Décathlon", "commission_rate": Decimal("10.00")},
    {"name": "Etsy", "commission_rate": Decimal("6.50")},
    {"name": "Ebay", "commission_rate": Decimal("10.00")},
    {"name": "Meduza Store", "commission_rate": Decimal("0.00")},
]

CATEGORIES_DATA = [
    {"name": "Vêtements", "subcategories": ["Hauts", "Pantalons", "Robes", "Vestes", "Accessoires"]},
    {"name": "Chaussures", "subcategories": ["Baskets", "Bottes", "Escarpins", "Sandales"]},
    {"name": "Sacs", "subcategories": ["Sacs à main", "Sacs à dos", "Pochette", "Tote bag"]},
    {"name": "Bijoux", "subcategories": ["Colliers", "Bracelets", "Boucles d'oreilles", "Montres"]},
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

FIRST_NAMES = [
    "Marie", "Sophie", "Julie", "Camille", "Emma", "Léa", "Chloé", "Manon",
    "Thomas", "Pierre", "Lucas", "Antoine", "Nicolas", "Alexandre", "Julien", "Maxime"
]

LAST_NAMES = [
    "Martin", "Bernard", "Dubois", "Thomas", "Robert", "Richard", "Petit", "Durand",
    "Leroy", "Moreau", "Simon", "Laurent", "Lefebvre", "Michel", "Garcia", "David"
]

ORDER_STATUSES = ["pending", "completed", "completed", "completed", "completed", "cancelled", "refunded"]
# Plus de "completed" pour avoir plus de ventes réussies


def get_or_create_countries(db: Session) -> dict[str, Country]:
    """Crée ou récupère les pays"""
    countries = {}
    for country_data in COUNTRIES_DATA:
        country = db.query(Country).filter(Country.code == country_data["code"]).first()
        if not country:
            country = Country(**country_data)
            db.add(country)
            db.commit()
            db.refresh(country)
        countries[country_data["code"]] = country
    return countries


def get_or_create_marketplaces(db: Session) -> dict[str, Marketplace]:
    """Crée ou récupère les marketplaces"""
    marketplaces = {}
    for marketplace_data in MARKETPLACES_DATA:
        marketplace = db.query(Marketplace).filter(Marketplace.name == marketplace_data["name"]).first()
        if not marketplace:
            marketplace = Marketplace(**marketplace_data)
            db.add(marketplace)
            db.commit()
            db.refresh(marketplace)
        marketplaces[marketplace_data["name"]] = marketplace
    return marketplaces


def get_or_create_categories(db: Session) -> dict[str, Category]:
    """Crée ou récupère les catégories et sous-catégories"""
    categories = {}
    subcategories = {}
    
    for cat_data in CATEGORIES_DATA:
        # Créer la catégorie principale
        category = db.query(Category).filter(Category.name == cat_data["name"]).first()
        if not category:
            category = Category(
                name=cat_data["name"],
                level=1,
                parent_id=None
            )
            db.add(category)
            db.commit()
            db.refresh(category)
        categories[cat_data["name"]] = category
        
        # Créer les sous-catégories
        for subcat_name in cat_data["subcategories"]:
            subcategory = db.query(Category).filter(
                Category.name == subcat_name,
                Category.parent_id == category.id
            ).first()
            if not subcategory:
                subcategory = Category(
                    name=subcat_name,
                    level=2,
                    parent_id=category.id
                )
                db.add(subcategory)
                db.commit()
                db.refresh(subcategory)
            subcategories[subcat_name] = subcategory
    
    return categories, subcategories


def create_products(db: Session, categories: dict, subcategories: dict, count: int = 50) -> list[Product]:
    """Crée des produits fictifs"""
    products = []
    
    for i in range(count):
        # Choisir une sous-catégorie aléatoire
        subcat_name = random.choice(list(subcategories.keys()))
        subcategory = subcategories[subcat_name]
        # Trouver la catégorie parente via parent_id
        category = None
        if subcategory.parent_id:
            for cat_name, cat_obj in categories.items():
                if cat_obj.id == subcategory.parent_id:
                    category = cat_obj
                    break
        if not category:
            # Fallback: prendre la première catégorie
            category = list(categories.values())[0]
        
        # Choisir un nom de produit
        product_names = PRODUCT_NAMES.get(subcat_name, ["Produit"])
        product_name = random.choice(product_names)
        
        # Générer un SKU unique
        sku = f"SKU-{subcat_name[:3].upper()}-{i+1:04d}"
        
        # Prix d'achat (entre 5€ et 50€)
        purchase_price = Decimal(str(round(random.uniform(5, 50), 2)))
        
        # Prix de vente HT (marge de 50% à 200%)
        margin_multiplier = random.uniform(1.5, 3.0)
        selling_price_ht = Decimal(str(round(float(purchase_price) * margin_multiplier, 2)))
        
        # Prix de vente TTC (TVA 20%)
        selling_price_ttc = Decimal(str(round(float(selling_price_ht) * 1.20, 2)))
        
        product = Product(
            sku=sku,
            name=f"{product_name} {random.choice(['vintage', 'moderne', 'classique', 'designer', ''])}",
            category_id=category.id,
            subcategory_id=subcategory.id,
            purchase_price=purchase_price,
            selling_price_ht=selling_price_ht,
            selling_price_ttc=selling_price_ttc,
            description=f"Produit de qualité en excellent état",
            photos_count=random.randint(1, 5),
            status=random.choice(["published", "published", "published", "draft"]),  # Plus de published
            is_online=random.choice([True, True, True, False]),  # Plus de produits en ligne
            is_draft=False,
            published_at=datetime.now() - timedelta(days=random.randint(1, 180)),
        )
        db.add(product)
        products.append(product)
    
    db.commit()
    for product in products:
        db.refresh(product)
    
    return products


def create_customers(db: Session, count: int = 100) -> list[Customer]:
    """Crée des clients fictifs"""
    customers = []
    emails_used = set()
    
    for i in range(count):
        first_name = random.choice(FIRST_NAMES)
        last_name = random.choice(LAST_NAMES)
        
        # Générer un email unique
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
            first_order_date=None,  # Sera mis à jour lors de la première commande
            last_order_date=None,  # Sera mis à jour lors de chaque commande
        )
        db.add(customer)
        customers.append(customer)
    
    db.commit()
    for customer in customers:
        db.refresh(customer)
    
    return customers


def create_orders(
    db: Session,
    customers: list[Customer],
    products: list[Product],
    marketplaces: dict[str, Marketplace],
    countries: dict[str, Country],
    num_orders: int = 200,
    months_back: int = 6
) -> list[Order]:
    """Crée des commandes fictives"""
    orders = []
    
    # Date de début (il y a X mois)
    start_date = datetime.now() - timedelta(days=months_back * 30)
    
    # Créer un batch d'import
    import_batch = ImportBatch(
        batch_number=f"BATCH-{datetime.now().strftime('%Y%m%d-%H%M%S')}",
        import_date=datetime.now(),
        records_imported=0,
        status="success",
        notes="Import de données fictives pour tests"
    )
    db.add(import_batch)
    db.commit()
    db.refresh(import_batch)
    
    for i in range(num_orders):
        # Date de commande aléatoire dans la période
        days_ago = random.randint(0, months_back * 30)
        order_date = start_date + timedelta(days=days_ago)
        
        # Choisir un client aléatoire
        customer = random.choice(customers)
        
        # Choisir une marketplace aléatoire
        marketplace = random.choice(list(marketplaces.values()))
        
        # Choisir un pays aléatoire
        country = random.choice(list(countries.values()))
        
        # Générer un numéro de commande unique
        order_number = f"ORD-{order_date.strftime('%Y%m%d')}-{i+1:05d}"
        
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
                net_margin=gross_margin,  # Marge nette initiale
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
        has_returns = random.random() < 0.05  # 5% de retours
        
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
        db.flush()  # Pour obtenir l'ID de la commande
        
        # Ajouter les order_items avec l'ID de la commande
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
    parser = argparse.ArgumentParser(description="Remplir la base de données avec des ventes fictives")
    parser.add_argument(
        "--orders", "-o",
        type=int,
        default=200,
        help="Nombre de commandes à créer (défaut: 200)"
    )
    parser.add_argument(
        "--months", "-m",
        type=int,
        default=6,
        help="Nombre de mois en arrière pour les dates de commande (défaut: 6)"
    )
    parser.add_argument(
        "--products", "-p",
        type=int,
        default=50,
        help="Nombre de produits à créer (défaut: 50)"
    )
    parser.add_argument(
        "--customers", "-c",
        type=int,
        default=100,
        help="Nombre de clients à créer (défaut: 100)"
    )
    parser.add_argument(
        "--clear",
        action="store_true",
        help="Supprimer toutes les données existantes avant de créer les nouvelles"
    )
    
    args = parser.parse_args()
    
    db = SessionLocal()
    
    try:
        print("=" * 60)
        print("GÉNÉRATION DE DONNÉES FICTIVES POUR LES VENTES")
        print("=" * 60)
        
        if args.clear:
            print("\n[ATTENTION] Suppression des donnees existantes...")
            db.query(OrderItem).delete()
            db.query(Order).delete()
            db.query(ProductMarketplace).delete()
            db.query(Product).delete()
            db.query(Customer).delete()
            db.commit()
            print("  [OK] Donnees supprimees")
        
        # 1. Créer ou récupérer les pays
        print("\n[1/6] Creation/recuperation des pays...")
        countries = get_or_create_countries(db)
        print(f"  [OK] {len(countries)} pays disponibles")
        
        # 2. Créer ou récupérer les marketplaces
        print("\n[2/6] Creation/recuperation des marketplaces...")
        marketplaces = get_or_create_marketplaces(db)
        print(f"  [OK] {len(marketplaces)} marketplaces disponibles")
        
        # 3. Créer ou récupérer les catégories
        print("\n[3/6] Creation/recuperation des categories...")
        categories, subcategories = get_or_create_categories(db)
        print(f"  [OK] {len(categories)} categories principales")
        print(f"  [OK] {len(subcategories)} sous-categories")
        
        # 4. Créer les produits
        print(f"\n[4/6] Creation de {args.products} produits...")
        products = create_products(db, categories, subcategories, args.products)
        print(f"  [OK] {len(products)} produits crees")
        
        # 5. Créer les clients
        print(f"\n[5/6] Creation de {args.customers} clients...")
        customers = create_customers(db, args.customers)
        print(f"  [OK] {len(customers)} clients crees")
        
        # 6. Créer les commandes
        print(f"\n[6/6] Creation de {args.orders} commandes sur {args.months} mois...")
        orders = create_orders(
            db, customers, products, marketplaces, countries,
            args.orders, args.months
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

