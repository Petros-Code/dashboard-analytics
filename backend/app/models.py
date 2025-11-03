from sqlalchemy import Column, Float, Integer, String, DateTime, ForeignKey, Boolean, Numeric, Date, Time, Text
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

# Création bdd Postgresql
Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=func.now())

    user_roles = relationship("UserRole", back_populates="user")

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    description = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=func.now())

    user_roles = relationship("UserRole", back_populates="role")

class UserRole(Base):
    __tablename__ = "users_roles"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    role_id = Column(Integer, ForeignKey("roles.id"), primary_key=True)
    assigned_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="user_roles")
    role = relationship("Role", back_populates="user_roles")

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    parent_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    level = Column(Integer, default=1)  # 1=catégorie, 2=sous-catégorie
    created_at = Column(DateTime, default=func.now())

    # Relations
    parent = relationship("Category", remote_side=[id], backref="subcategories")
    products = relationship("Product", back_populates="category")

class Marketplace(Base):
    __tablename__ = "marketplaces"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)  # Amazon, Etsy, Vinted, etc.
    commission_rate = Column(Numeric(5, 2), nullable=True)  # Taux de commission en %
    created_at = Column(DateTime, default=func.now())

    # Relations
    product_marketplaces = relationship("ProductMarketplace", back_populates="marketplace")
    orders = relationship("Order", back_populates="marketplace")

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    platform_customer_id = Column(String(100), unique=True, nullable=True)  # ID depuis la plateforme externe
    email = Column(String(255), unique=True, nullable=False)
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    first_order_date = Column(DateTime, nullable=True)
    last_order_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relations
    orders = relationship("Order", back_populates="customer")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    platform_product_id = Column(String(100), unique=True, nullable=True)  # ID depuis la plateforme
    sku = Column(String(100), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    subcategory_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    purchase_price = Column(Numeric(10, 2), nullable=True)  # Prix d'achat
    selling_price_ht = Column(Numeric(10, 2), nullable=True)
    selling_price_ttc = Column(Numeric(10, 2), nullable=True)
    description = Column(Text, nullable=True)
    photos_count = Column(Integer, default=0)
    status = Column(String(50), default="draft")  # published, draft, sold, archived
    is_online = Column(Boolean, default=False)  # Annonce validée en ligne
    is_draft = Column(Boolean, default=True)  # Brouillon
    published_at = Column(DateTime, nullable=True)
    sold_at = Column(DateTime, nullable=True)
    import_batch_id = Column(Integer, ForeignKey("import_batches.id"), nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relations
    category = relationship("Category", foreign_keys=[category_id], back_populates="products")
    subcategory = relationship("Category", foreign_keys=[subcategory_id])
    product_marketplaces = relationship("ProductMarketplace", back_populates="product")
    order_items = relationship("OrderItem", back_populates="product")

class ProductMarketplace(Base):
    __tablename__ = "product_marketplaces"

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    marketplace_id = Column(Integer, ForeignKey("marketplaces.id"), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())

    # Relations
    product = relationship("Product", back_populates="product_marketplaces")
    marketplace = relationship("Marketplace", back_populates="product_marketplaces")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, autoincrement=True)
    platform_order_id = Column(String(100), unique=True, nullable=True)  # ID depuis la plateforme externe
    order_number = Column(String(100), unique=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    marketplace_id = Column(Integer, ForeignKey("marketplaces.id"), nullable=False)
    country_code = Column(String(10), nullable=True)  # FR, US, etc.
    order_date = Column(DateTime, nullable=False)
    subtotal_ht = Column(Numeric(10, 2), nullable=False)
    discount_amount = Column(Numeric(10, 2), default=0.00)
    tax_amount = Column(Numeric(10, 2), default=0.00)
    total_ht = Column(Numeric(10, 2), nullable=False)
    total_ttc = Column(Numeric(10, 2), nullable=False)
    status = Column(String(50), default="pending")  # pending, completed, cancelled, refunded, returned
    has_returns = Column(Boolean, default=False)
    is_refunded = Column(Boolean, default=False)
    is_cancelled = Column(Boolean, default=False)
    promo_code_id = Column(Integer, ForeignKey("promo_codes.id"), nullable=True)
    import_batch_id = Column(Integer, ForeignKey("import_batches.id"), nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relations
    customer = relationship("Customer", back_populates="orders")
    marketplace = relationship("Marketplace", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order")
    promo_code = relationship("PromoCode", foreign_keys=[promo_code_id])
    order_promo_codes = relationship("OrderPromoCode", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)  # Nullable au cas où produit supprimé
    product_name = Column(String(255), nullable=False)  # Sauvegardé au cas où produit supprimé
    quantity = Column(Integer, default=1, nullable=False)
    unit_price_ht = Column(Numeric(10, 2), nullable=False)
    unit_price_ttc = Column(Numeric(10, 2), nullable=False)
    total_price_ht = Column(Numeric(10, 2), nullable=False)
    total_price_ttc = Column(Numeric(10, 2), nullable=False)
    cost_price = Column(Numeric(10, 2), nullable=True)  # Prix d'achat unitaire
    gross_margin = Column(Numeric(10, 2), nullable=True)  # Marge brute = selling_price - cost_price
    net_margin = Column(Numeric(10, 2), nullable=True)  # Marge nette initiale
    packaging_cost = Column(Numeric(10, 2), default=0.00)  # Frais conditionnement
    washing_cost = Column(Numeric(10, 2), default=0.00)  # Frais lavage
    marketplace_commission = Column(Numeric(10, 2), default=0.00)  # Commissions marketplace
    other_costs = Column(Numeric(10, 2), default=0.00)  # Divers
    calculated_net_margin = Column(Numeric(10, 2), nullable=True)  # Marge nette recalculée après frais
    created_at = Column(DateTime, default=func.now())

    # Relations
    order = relationship("Order", back_populates="order_items")
    product = relationship("Product", back_populates="order_items")

class PromoCode(Base):
    __tablename__ = "promo_codes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String(50), unique=True, nullable=False)
    discount_type = Column(String(20), nullable=False)  # percentage, fixed
    discount_value = Column(Numeric(10, 2), nullable=False)
    max_uses = Column(Integer, nullable=True)
    current_uses = Column(Integer, default=0)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relations
    order_promo_codes = relationship("OrderPromoCode", back_populates="promo_code")

class OrderPromoCode(Base):
    __tablename__ = "order_promo_codes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    promo_code_id = Column(Integer, ForeignKey("promo_codes.id"), nullable=False)
    discount_applied = Column(Numeric(10, 2), nullable=False)
    used_at = Column(DateTime, default=func.now())

    # Relations
    order = relationship("Order", back_populates="order_promo_codes")
    promo_code = relationship("PromoCode", back_populates="order_promo_codes")

class ImportBatch(Base):
    __tablename__ = "import_batches"

    id = Column(Integer, primary_key=True, autoincrement=True)
    batch_number = Column(String(100), unique=True, nullable=False)
    import_date = Column(DateTime, nullable=False)
    records_imported = Column(Integer, default=0)
    status = Column(String(50), default="success")  # success, failed, partial
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now())

    # Relations
    products = relationship("Product", backref="import_batch")
    orders = relationship("Order", backref="import_batch_order")

class SocialMediaStats(Base):
    __tablename__ = "social_media_stats"

    id = Column(Integer, primary_key=True, autoincrement=True)
    platform = Column(String(50), nullable=False)  # instagram, tiktok
    follower_count = Column(Integer, nullable=False)
    snapshot_date = Column(Date, nullable=False)
    snapshot_time = Column(Time, nullable=False)  # Heure du snapshot (ex: 03:00)
    created_at = Column(DateTime, default=func.now())

class WebsiteAnalytics(Base):
    __tablename__ = "website_analytics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(Date, unique=True, nullable=False)
    visits = Column(Integer, default=0)
    unique_visitors = Column(Integer, default=0)
    page_views = Column(Integer, default=0)
    bounce_rate = Column(Numeric(5, 2), nullable=True)  # Pourcentage
    avg_session_duration = Column(Integer, nullable=True)  # En secondes
    cart_abandonment_rate = Column(Numeric(5, 2), nullable=True)  # Pourcentage
    conversion_rate = Column(Numeric(5, 2), nullable=True)  # Pourcentage
    snapshot_time = Column(Time, nullable=False)  # Heure du snapshot (ex: 03:00)
    created_at = Column(DateTime, default=func.now())
