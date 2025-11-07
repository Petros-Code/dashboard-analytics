# Guide : Voir vos tables dans Beekeeper Studio

## 🔍 Pourquoi vous ne voyez que `information_schema` et `pg_catalog` ?

Ces deux dossiers sont des **schémas système** de PostgreSQL. Vos tables personnalisées sont dans le schéma **`public`**.

## 📋 Comment voir vos tables dans Beekeeper Studio

### Option 1 : Développer le schéma "public"

1. Dans Beekeeper Studio, regardez dans la barre latérale gauche
2. Vous devriez voir un dossier nommé **`public`** (ou `Public`)
3. Développez ce dossier pour voir vos tables

### Option 2 : Filtrer par schéma

1. Dans Beekeeper, cherchez une option de filtre ou de recherche
2. Filtrez par schéma = `public`
3. Vous verrez uniquement vos tables personnalisées

### Option 3 : Requête SQL directe

Exécutez cette requête dans Beekeeper pour lister toutes vos tables :

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

## ⚠️ Si vous ne voyez aucune table dans "public"

Cela signifie que les tables n'ont pas encore été créées. Voici comment les créer :

### Étape 1 : Vérifier l'état actuel

```bash
cd backend
python check_tables.py
```

Ce script vous dira quelles tables existent et lesquelles manquent.

### Étape 2 : Créer une nouvelle migration

Si des tables manquent, créez une nouvelle migration :

```bash
cd backend
alembic revision --autogenerate -m "ajout_toutes_tables"
```

Cette commande va :
- Comparer vos modèles dans `models.py` avec l'état actuel de la base
- Générer automatiquement une migration pour créer les tables manquantes

### Étape 3 : Appliquer les migrations

```bash
alembic upgrade head
```

Cette commande exécute toutes les migrations en attente et crée les tables.

### Étape 4 : Vérifier à nouveau

```bash
python check_tables.py
```

Vous devriez maintenant voir toutes vos tables listées.

## 📊 Tables attendues

D'après votre fichier `models.py`, vous devriez avoir ces tables :

- `users`
- `roles`
- `users_roles`
- `categories`
- `marketplaces`
- `customers`
- `products`
- `product_marketplaces`
- `orders`
- `order_items`
- `promo_codes`
- `order_promo_codes`
- `import_batches`
- `social_media_stats`
- `website_analytics`

## 🔧 Commandes utiles

### Voir l'état des migrations
```bash
alembic current
alembic history
```

### Créer les tables manuellement (non recommandé en production)
Si vous voulez créer les tables sans migration (pour tester) :

```python
from app.core.database import engine, Base
from app.models import *  # Importe tous les modèles

Base.metadata.create_all(bind=engine)
```

⚠️ **Note** : Cette méthode n'est pas recommandée en production. Utilisez toujours Alembic pour les migrations.

## 🐛 Dépannage

### Erreur : "No such table"
→ Les migrations n'ont pas été exécutées. Exécutez `alembic upgrade head`

### Erreur : "relation already exists"
→ Les tables existent déjà. Vérifiez avec `python check_tables.py`

### Tables partiellement créées
→ Vérifiez les migrations avec `alembic history` et exécutez `alembic upgrade head`

