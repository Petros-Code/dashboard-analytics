# Guide de test de l'API

## 🚀 Démarrage du serveur

### Option 1 : Avec Poetry (Recommandé)

```bash
cd backend
python -m poetry run uvicorn app.main:app --reload
```

### Option 2 : Avec Python directement

```bash
cd backend
uvicorn app.main:app --reload
```

Le serveur démarre sur : **http://localhost:8000**

## 📍 Adresse de base

**URL de base :** `http://localhost:8000`

## 📚 Documentation automatique

FastAPI génère automatiquement une documentation interactive :

- **Swagger UI :** http://localhost:8000/docs
- **ReDoc :** http://localhost:8000/redoc

## 🧪 Routes à tester dans Insomnia/Postman

### Routes principales

#### 1. Root endpoint
```
GET http://localhost:8000/
```

**Réponse attendue :**
```json
{
  "message": "Dashboard Analytics API",
  "version": "1.0.0"
}
```

#### 2. Health check
```
GET http://localhost:8000/health
```

**Réponse attendue :**
```json
{
  "status": "healthy"
}
```

### Routes User (CRUD complet)

#### 3. Créer un utilisateur
```
POST http://localhost:8000/api/v1/users
Content-Type: application/json
```

**Body (JSON) :**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "motdepasse123"
}
```

**Réponse attendue (201 Created) :**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "created_at": "2024-01-15T10:30:00"
}
```

#### 4. Lister tous les utilisateurs
```
GET http://localhost:8000/api/v1/users?skip=0&limit=100
```

**Query Parameters (optionnels) :**
- `skip` : Nombre d'éléments à sauter (défaut: 0)
- `limit` : Nombre d'éléments à retourner (défaut: 100)

**Réponse attendue :**
```json
{
  "items": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "created_at": "2024-01-15T10:30:00"
    }
  ],
  "total": 1,
  "skip": 0,
  "limit": 100
}
```

#### 5. Obtenir un utilisateur par ID
```
GET http://localhost:8000/api/v1/users/1
```

**Réponse attendue :**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "created_at": "2024-01-15T10:30:00"
}
```

#### 6. Mettre à jour un utilisateur
```
PUT http://localhost:8000/api/v1/users/1
Content-Type: application/json
```

**Body (JSON) - Tous les champs sont optionnels :**
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "nouveaumotdepasse"
}
```

**Réponse attendue :**
```json
{
  "id": 1,
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "created_at": "2024-01-15T10:30:00"
}
```

#### 7. Supprimer un utilisateur
```
DELETE http://localhost:8000/api/v1/users/1
```

**Réponse attendue :** 204 No Content (pas de body)

## 📋 Collection Insomnia complète

### Variables d'environnement dans Insomnia

Créez une variable d'environnement :
- `base_url` = `http://localhost:8000`

Puis utilisez : `{{base_url}}/api/v1/users`

### Ordre de test recommandé

1. **GET** `/` - Vérifier que le serveur fonctionne
2. **GET** `/health` - Vérifier la santé de l'API
3. **POST** `/api/v1/users` - Créer un utilisateur
4. **GET** `/api/v1/users` - Lister les utilisateurs
5. **GET** `/api/v1/users/{id}` - Obtenir l'utilisateur créé
6. **PUT** `/api/v1/users/{id}` - Mettre à jour l'utilisateur
7. **DELETE** `/api/v1/users/{id}` - Supprimer l'utilisateur

## ⚠️ Erreurs courantes

### Erreur 404 - Not Found
- Vérifiez que le serveur est bien démarré
- Vérifiez l'URL (doit commencer par `/api/v1/`)

### Erreur 422 - Validation Error
- Vérifiez le format JSON du body
- Vérifiez que tous les champs requis sont présents
- Vérifiez le type des données (email doit être valide)

### Erreur 409 - Conflict
- L'email existe déjà dans la base de données
- Utilisez un email différent

### Erreur 500 - Internal Server Error
- Vérifiez que la base de données est accessible
- Vérifiez les variables d'environnement (DATABASE_URL)
- Consultez les logs du serveur

## 🔍 Exemple de requête complète dans Insomnia

### Configuration de la requête

**Method :** POST  
**URL :** `http://localhost:8000/api/v1/users`  
**Headers :**
```
Content-Type: application/json
```

**Body (JSON) :**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

## 📝 Notes importantes

1. Le mot de passe est automatiquement hashé (bcrypt) avant d'être stocké
2. L'email doit être unique (sinon erreur 409)
3. Tous les endpoints nécessitent une connexion à la base de données
4. La documentation Swagger est disponible sur `/docs` pour tester directement depuis le navigateur

