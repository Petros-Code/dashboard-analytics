# Guide des Migrations Alembic

Ce guide explique comment exécuter les migrations Alembic pour ce projet qui utilise **Poetry** pour la gestion des dépendances.

## Prérequis

Assurez-vous que Poetry est installé et que les dépendances sont installées :

```bash
cd dashboard-analytics/backend
python -m poetry install
```

## Exécuter les migrations

### Méthode 1 : Avec Poetry (Recommandée)

```bash
cd dashboard-analytics/backend
python -m poetry run alembic upgrade head
```

### Méthode 2 : Script Python

Un script `run_migration.py` est disponible pour simplifier l'exécution :

```bash
cd dashboard-analytics/backend
python run_migration.py
```

Ce script essaie d'abord d'utiliser Poetry, puis fait un fallback vers Python direct si nécessaire.

### Méthode 3 : Commandes Alembic directes

Si vous avez activé l'environnement virtuel Poetry :

```bash
cd dashboard-analytics/backend
python -m poetry shell
alembic upgrade head
```

## Créer une nouvelle migration

Pour créer une nouvelle migration après avoir modifié les modèles dans `app/models.py` :

```bash
cd dashboard-analytics/backend
python -m poetry run alembic revision --autogenerate -m "description_de_la_migration"
```

## Vérifier l'état des migrations

```bash
# Voir la migration actuelle
python -m poetry run alembic current

# Voir l'historique des migrations
python -m poetry run alembic history

# Voir les migrations en attente
python -m poetry run alembic heads
```

## Revenir en arrière

Pour annuler la dernière migration :

```bash
python -m poetry run alembic downgrade -1
```

Pour revenir à une version spécifique :

```bash
python -m poetry run alembic downgrade <revision_id>
```

## Vérifier les tables créées

Après avoir exécuté les migrations, vous pouvez vérifier que les tables ont été créées :

```bash
cd dashboard-analytics/backend
python check_tables.py
```

## Notes importantes

- ⚠️ **Toujours utiliser Poetry** pour exécuter les migrations afin d'utiliser les bonnes versions des dépendances
- ⚠️ **Ne jamais modifier manuellement** les fichiers de migration après leur création
- ⚠️ **Sauvegarder la base de données** avant d'exécuter des migrations en production
- ✅ Les migrations sont automatiquement appliquées au démarrage du backend dans Docker

