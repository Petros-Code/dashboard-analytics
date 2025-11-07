# Structure complète du projet

```
backend/
├── alembic/                          # Migrations de base de données
│   ├── env.py
│   └── versions/
│
├── app/
│   ├── __init__.py
│   ├── main.py                       # Point d'entrée FastAPI
│   ├── models.py                     # Modèles SQLAlchemy (entités DB)
│   │
│   ├── core/                         # Configuration et classes de base
│   │   ├── __init__.py
│   │   ├── config.py                # Configuration centralisée (Settings)
│   │   ├── database.py              # Configuration DB et session
│   │   ├── exceptions.py            # Exceptions personnalisées
│   │   ├── base_repository.py       # Classe de base pour repositories
│   │   └── base_service.py          # Classe de base pour services
│   │
│   ├── dto/                          # Data Transfer Objects (Pydantic)
│   │   ├── __init__.py
│   │   └── user_dto.py              # DTOs User (Create, Update, Response)
│   │
│   ├── repositories/                 # Couche d'accès aux données
│   │   ├── __init__.py
│   │   ├── base_repository.py       # Ré-export BaseRepository
│   │   └── user_repository.py       # Repository User
│   │
│   ├── services/                     # Couche de logique métier
│   │   ├── __init__.py
│   │   └── user_service.py          # Service User
│   │
│   ├── controllers/                  # Couche de contrôle
│   │   ├── __init__.py
│   │   └── user_controller.py       # Controller User
│   │
│   ├── api/                          # Routes HTTP
│   │   └── v1/                       # Version 1 de l'API
│   │       ├── __init__.py
│   │       ├── api.py               # Agrégation des routes v1
│   │       └── routes/               # Routes par ressource
│   │           ├── __init__.py
│   │           └── user_routes.py   # Routes HTTP User
│   │
│   └── middlewares/                  # Middlewares (auth, roles, etc.)
│       ├── __init__.py
│       ├── auth_middleware.py
│       └── role_middleware.py
│
├── Dockerfile
├── pyproject.toml                    # Dépendances Poetry
├── poetry.lock
├── alembic.ini
├── ARCHITECTURE.md                   # Documentation de l'architecture
├── README_ARCHITECTURE.md            # Guide d'utilisation
└── STRUCTURE.md                      # Ce fichier
```

## Flux de données

```
HTTP Request (POST /api/v1/users)
    ↓
┌─────────────────────────────────┐
│ Routes (api/v1/routes/)         │ → Définit les endpoints HTTP
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ Controller (controllers/)       │ → Gère les requêtes/réponses HTTP
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ Service (services/)              │ → Logique métier
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ Repository (repositories/)      │ → Accès à la base de données
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ Database (PostgreSQL)           │ → Stockage des données
└─────────────────────────────────┘
```

## Responsabilités de chaque couche

### 🎯 Routes (`api/v1/routes/`)
- Définit les endpoints HTTP (GET, POST, PUT, DELETE)
- Définit les tags OpenAPI
- Définit les schémas de réponse avec Pydantic
- Appelle les controllers

### 🎮 Controller (`controllers/`)
- Reçoit les requêtes HTTP
- Valide les entrées avec Pydantic
- Appelle les services
- Convertit les exceptions en réponses HTTP
- Formate les réponses

### ⚙️ Service (`services/`)
- Contient toute la logique métier
- Valide les règles business
- Transforme les données (hashage, calculs, etc.)
- Utilise les repositories pour accéder aux données
- Ne connaît pas HTTP

### 💾 Repository (`repositories/`)
- Accès direct à la base de données
- Opérations CRUD de base (hérite de BaseRepository)
- Méthodes spécifiques par modèle (get_by_email, etc.)
- Gère les transactions SQLAlchemy

### 📦 DTO (`dto/`)
- Schémas Pydantic pour validation
- Séparation entre modèles DB et API
- Types stricts pour les entrées/sorties

### 🏗️ Core (`core/`)
- Configuration globale
- Classes de base réutilisables
- Exceptions personnalisées
- Configuration de la base de données

## Exemple de code complet

### Route
```python
@router.post("/", response_model=UserResponse)
async def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    return controller.create_user(user_data, db)
```

### Controller
```python
def create_user(user_data: UserCreate, db: Session) -> UserResponse:
    try:
        service = UserService(db)
        user = service.create_user(user_data)
        return UserResponse.model_validate(user)
    except BaseAppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
```

### Service
```python
def create_user(self, user_data: UserCreate) -> User:
    if self.repository.email_exists(user_data.email):
        raise ConflictError("Email already exists")
    hashed_password = self._hash_password(user_data.password)
    return self.repository.create(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_password
    )
```

### Repository
```python
def create(self, **kwargs) -> User:
    db_obj = User(**kwargs)
    self.db.add(db_obj)
    self.db.commit()
    self.db.refresh(db_obj)
    return db_obj
```

## Avantages

✅ **Maintenabilité** : Code organisé et facile à comprendre  
✅ **Testabilité** : Chaque couche testable indépendamment  
✅ **Scalabilité** : Facile d'ajouter de nouvelles fonctionnalités  
✅ **Séparation des responsabilités** : Chaque couche a un rôle précis  
✅ **Réutilisabilité** : Classes de base pour éviter la duplication  
✅ **Type safety** : Pydantic garantit la structure des données  

