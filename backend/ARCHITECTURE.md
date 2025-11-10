# Architecture du Backend

## Structure des dossiers

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # Point d'entrée de l'application
│   ├── models.py                  # Modèles SQLAlchemy (entités de base de données)
│   │
│   ├── core/                      # Configuration et classes de base
│   │   ├── __init__.py
│   │   ├── config.py             # Configuration de l'application
│   │   ├── database.py           # Configuration de la base de données
│   │   ├── exceptions.py         # Exceptions personnalisées
│   │   ├── base_repository.py     # Classe de base pour les repositories
│   │   └── base_service.py       # Classe de base pour les services
│   │
│   ├── dto/                       # Data Transfer Objects (Pydantic schemas)
│   │   ├── __init__.py
│   │   └── user_dto.py           # DTOs pour User (Create, Update, Response)
│   │
│   ├── repositories/              # Couche d'accès aux données (Repository Pattern)
│   │   ├── __init__.py
│   │   ├── base_repository.py    # Ré-export de la base repository
│   │   └── user_repository.py    # Repository pour User
│   │
│   ├── services/                  # Couche de logique métier (Business Logic)
│   │   ├── __init__.py
│   │   └── user_service.py       # Service pour User
│   │
│   ├── controllers/               # Couche de contrôle (Request/Response handling)
│   │   ├── __init__.py
│   │   └── user_controller.py    # Controller pour User
│   │
│   └── api/                       # Routes HTTP (Endpoints)
│       └── v1/                    # Version 1 de l'API
│           ├── __init__.py
│           ├── api.py            # Agrégation de toutes les routes v1
│           └── routes/           # Routes par ressource
│               ├── __init__.py
│               └── user_routes.py # Routes HTTP pour User
│
└── alembic/                       # Migrations de base de données
```

## Architecture en couches

### 1. **Repository (Couche d'accès aux données)**
- Responsabilité : Accès direct à la base de données
- Hérite de `BaseRepository` qui fournit les opérations CRUD de base
- Exemple : `UserRepository` - méthodes pour interagir avec la table `users`

**Principe** : Une seule responsabilité - gérer les opérations de base de données

### 2. **Service (Couche de logique métier)**
- Responsabilité : Logique métier, validation, transformations
- Utilise les repositories pour accéder aux données
- Exemple : `UserService` - hashage de mots de passe, validation d'email, règles métier

**Principe** : Contient toute la logique métier indépendante de HTTP

### 3. **Controller (Couche de contrôle)**
- Responsabilité : Gestion des requêtes HTTP, validation des entrées, formatage des réponses
- Utilise les services pour exécuter la logique métier
- Convertit les exceptions métier en réponses HTTP appropriées

**Principe** : Interface entre HTTP et la logique métier

### 4. **Routes (Couche de routage)**
- Responsabilité : Définition des endpoints HTTP, méthodes (GET, POST, PUT, DELETE)
- Utilise les controllers pour gérer les requêtes
- Définit les schémas de réponse avec Pydantic

**Principe** : Déclaration des routes et intégration avec FastAPI

### 5. **DTOs (Data Transfer Objects)**
- Responsabilité : Définition des schémas de données pour les requêtes et réponses
- Utilise Pydantic pour la validation automatique
- Séparation entre modèles de base de données et schémas API

**Principe** : Contrôle strict des données entrantes et sortantes

## Flux de données

```
HTTP Request
    ↓
Routes (api/v1/routes/user_routes.py)
    ↓
Controller (controllers/user_controller.py)
    ↓
Service (services/user_service.py)
    ↓
Repository (repositories/user_repository.py)
    ↓
Database (via SQLAlchemy)
```

## Exemple d'utilisation

### Créer un nouveau module (ex: Product)

1. **DTO** : Créer `dto/product_dto.py`
   - `ProductCreate`, `ProductUpdate`, `ProductResponse`

2. **Repository** : Créer `repositories/product_repository.py`
   - Hérite de `BaseRepository[Product]`
   - Ajoutez des méthodes spécifiques si nécessaire

3. **Service** : Créer `services/product_service.py`
   - Hérite de `BaseService`
   - Utilise `ProductRepository`
   - Ajoutez la logique métier

4. **Controller** : Créer `controllers/product_controller.py`
   - Méthodes statiques qui utilisent `ProductService`
   - Gère les exceptions et formatte les réponses

5. **Routes** : Créer `api/v1/routes/product_routes.py`
   - Définit les endpoints HTTP
   - Utilise `ProductController`
   - Ajoutez le router dans `api/v1/api.py`

## Bonnes pratiques

1. **Séparation des responsabilités** : Chaque couche a une responsabilité claire
2. **Dépendances** : Repository → Service → Controller → Routes (jamais dans l'autre sens)
3. **Exceptions** : Utilisez les exceptions personnalisées dans `core/exceptions.py`
4. **Validation** : Utilisez Pydantic pour valider les entrées
5. **DRY** : Réutilisez `BaseRepository` et `BaseService` pour éviter la duplication
6. **Versioning** : Utilisez `/api/v1/` pour permettre l'évolution de l'API

## Avantages de cette architecture

- **Maintenabilité** : Code organisé et facile à comprendre
- **Testabilité** : Chaque couche peut être testée indépendamment
- **Scalabilité** : Facile d'ajouter de nouvelles fonctionnalités
- **Séparation des préoccupations** : Chaque couche a un rôle précis
- **Réutilisabilité** : Les classes de base permettent la réutilisation du code

