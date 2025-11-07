# Guide d'utilisation de l'architecture

## 📋 Vue d'ensemble

Cette architecture suit le pattern **Repository → Service → Controller → Routes**, une approche éprouvée pour les applications Python/FastAPI.

## 🏗️ Structure de l'architecture

```
HTTP Request → Routes → Controller → Service → Repository → Database
```

Chaque couche a une responsabilité précise et ne dépend que de la couche inférieure.

## 📝 Comment créer un nouveau module

### Exemple : Créer le module "Product"

#### 1. Créer les DTOs (`app/dto/product_dto.py`)

```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from decimal import Decimal

class ProductBase(BaseModel):
    name: str
    sku: str
    category_id: int
    purchase_price: Optional[Decimal] = None
    selling_price_ht: Optional[Decimal] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    purchase_price: Optional[Decimal] = None
    selling_price_ht: Optional[Decimal] = None

class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    skip: int
    limit: int
```

#### 2. Créer le Repository (`app/repositories/product_repository.py`)

```python
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models import Product
from app.core.base_repository import BaseRepository

class ProductRepository(BaseRepository[Product]):
    def __init__(self, db: Session):
        super().__init__(Product, db)
    
    def get_by_sku(self, sku: str) -> Optional[Product]:
        """Get a product by SKU"""
        return self.db.query(Product).filter(Product.sku == sku).first()
    
    def get_by_category(self, category_id: int) -> List[Product]:
        """Get all products in a category"""
        return self.db.query(Product).filter(Product.category_id == category_id).all()
```

#### 3. Créer le Service (`app/services/product_service.py`)

```python
from typing import List
from sqlalchemy.orm import Session
from app.repositories.product_repository import ProductRepository
from app.dto.product_dto import ProductCreate, ProductUpdate
from app.models import Product
from app.core.exceptions import NotFoundError, ConflictError

class ProductService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = ProductRepository(db)
    
    def create_product(self, product_data: ProductCreate) -> Product:
        """Create a new product with business logic"""
        # Vérifier si le SKU existe déjà
        if self.repository.get_by_sku(product_data.sku):
            raise ConflictError(f"Product with SKU {product_data.sku} already exists")
        
        # Créer le produit
        return self.repository.create(**product_data.model_dump())
    
    def get_product_by_id(self, product_id: int) -> Product:
        """Get a product by ID"""
        product = self.repository.get_by_id(product_id)
        if not product:
            raise NotFoundError("Product", str(product_id))
        return product
    
    # ... autres méthodes
```

#### 4. Créer le Controller (`app/controllers/product_controller.py`)

```python
from fastapi import HTTPException, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.product_service import ProductService
from app.dto.product_dto import ProductCreate, ProductUpdate, ProductResponse
from app.core.exceptions import BaseAppException

class ProductController:
    @staticmethod
    def create_product(
        product_data: ProductCreate,
        db: Session = Depends(get_db)
    ) -> ProductResponse:
        """Create a new product"""
        try:
            service = ProductService(db)
            product = service.create_product(product_data)
            return ProductResponse.model_validate(product)
        except BaseAppException as e:
            raise HTTPException(status_code=e.status_code, detail=e.message)
```

#### 5. Créer les Routes (`app/api/v1/routes/product_routes.py`)

```python
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.controllers.product_controller import ProductController
from app.dto.product_dto import ProductCreate, ProductResponse

router = APIRouter(
    prefix="/products",
    tags=["products"]
)

controller = ProductController()

@router.post(
    "/",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new product"
)
async def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db)
):
    """Create a new product"""
    return controller.create_product(product_data, db)
```

#### 6. Ajouter les routes dans `app/api/v1/api.py`

```python
from fastapi import APIRouter
from app.api.v1.routes import user_routes, product_routes

api_router = APIRouter()

api_router.include_router(user_routes.router)
api_router.include_router(product_routes.router)  # Ajouter cette ligne
```

## 🔄 Flux de données complet

### Exemple : Créer un utilisateur

1. **Client HTTP** envoie `POST /api/v1/users` avec des données JSON
2. **Route** (`user_routes.py`) reçoit la requête
3. **Controller** (`user_controller.py`) valide et appelle le service
4. **Service** (`user_service.py`) applique la logique métier (hashage du mot de passe)
5. **Repository** (`user_repository.py`) exécute la requête SQL
6. **Base de données** enregistre les données
7. La réponse remonte à travers les couches jusqu'au client

## ✅ Bonnes pratiques

### 1. Ne jamais sauter de couche
❌ **Mauvais** : Route → Repository (saute Controller et Service)
✅ **Bon** : Route → Controller → Service → Repository

### 2. Logique métier dans le Service
❌ **Mauvais** : Hashage du mot de passe dans le Controller
✅ **Bon** : Hashage du mot de passe dans le Service

### 3. Accès DB uniquement dans le Repository
❌ **Mauvais** : Requêtes SQL dans le Service
✅ **Bon** : Toutes les requêtes SQL dans le Repository

### 4. Gestion des erreurs
- Utilisez les exceptions personnalisées de `core/exceptions.py`
- Le Controller convertit les exceptions en réponses HTTP

### 5. Validation des données
- Utilisez Pydantic pour valider automatiquement les entrées
- Les DTOs garantissent la structure des données

## 🧪 Tests

Chaque couche peut être testée indépendamment :

```python
# Test du Repository
def test_user_repository():
    repo = UserRepository(db)
    user = repo.create(name="Test", email="test@test.com")
    assert user.id is not None

# Test du Service
def test_user_service():
    service = UserService(db)
    user = service.create_user(UserCreate(...))
    assert user.hashed_password != "plain_password"

# Test du Controller
def test_user_controller():
    controller = UserController()
    response = controller.create_user(UserCreate(...), db)
    assert response.id is not None
```

## 📦 Dépendances

Pour installer les nouvelles dépendances :

```bash
cd backend
poetry install
```

Les dépendances nécessaires sont déjà dans `pyproject.toml` :
- `passlib` et `bcrypt` pour le hashage des mots de passe
- `email-validator` pour la validation des emails

## 🚀 Prochaines étapes

1. Créez les modules manquants (Product, Order, etc.) en suivant le même pattern
2. Ajoutez l'authentification JWT dans les middlewares
3. Ajoutez des tests unitaires pour chaque couche
4. Documentez votre API avec les docstrings FastAPI

