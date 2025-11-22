# Guide : Génération de Données Fictives pour les Ventes

Ce script permet de remplir la base de données avec des ventes fictives pour tester les graphiques avec Recharts.

## 🚀 Utilisation

### Méthode 1 : Avec Poetry (Recommandée)

```bash
cd dashboard-analytics/backend
python -m poetry run python seed_sales_data.py
```

### Méthode 2 : Avec Python directement

```bash
cd dashboard-analytics/backend
python seed_sales_data.py
```

## 📋 Options disponibles

### Options de base

```bash
# Générer 200 commandes sur 6 mois (valeurs par défaut)
python seed_sales_data.py

# Générer 500 commandes sur 12 mois
python seed_sales_data.py --orders 500 --months 12

# Générer avec plus de produits et clients
python seed_sales_data.py --products 100 --customers 200 --orders 300

# Supprimer les données existantes avant de créer les nouvelles
python seed_sales_data.py --clear
```

### Options complètes

| Option | Court | Description | Défaut |
|--------|-------|-------------|--------|
| `--orders` | `-o` | Nombre de commandes à créer | 200 |
| `--months` | `-m` | Nombre de mois en arrière pour les dates | 6 |
| `--products` | `-p` | Nombre de produits à créer | 50 |
| `--customers` | `-c` | Nombre de clients à créer | 100 |
| `--clear` | - | Supprimer les données existantes avant | False |

## 📊 Données générées

Le script génère automatiquement :

### 1. **Pays** (9 pays)
- France, Belgique, Suisse, Espagne, Italie, Allemagne, Royaume-Uni, États-Unis, Canada

### 2. **Marketplaces** (5 marketplaces)
- Vinted (5% commission)
- Vestiaire Collective (12% commission)
- eBay (10% commission)
- Depop (10% commission)
- Marketplace Privé (0% commission)

### 3. **Catégories et Sous-catégories**
- **Vêtements** : Hauts, Pantalons, Robes, Vestes, Accessoires
- **Chaussures** : Baskets, Bottes, Escarpins, Sandales
- **Sacs** : Sacs à main, Sacs à dos, Pochette, Tote bag
- **Bijoux** : Colliers, Bracelets, Boucles d'oreilles, Montres

### 4. **Produits**
- SKU unique pour chaque produit
- Prix d'achat entre 5€ et 50€
- Prix de vente avec marge de 50% à 200%
- Statut aléatoire (published, draft)
- Photos (1 à 5)

### 5. **Clients**
- 100 clients par défaut
- Noms et prénoms français
- Emails uniques
- Dates de première et dernière commande mises à jour automatiquement

### 6. **Commandes**
- 200 commandes par défaut
- Réparties sur 6 mois par défaut
- 1 à 3 produits par commande
- Statuts variés : completed (majorité), pending, cancelled, refunded
- Calculs automatiques :
  - Sous-totaux HT et TTC
  - Taxes (TVA 20%)
  - Réductions (10% des commandes)
  - Commissions marketplace
  - Marges brutes et nettes
  - Coûts (conditionnement, lavage, divers)

## 📈 Statistiques affichées

Après la génération, le script affiche :
- Nombre de commandes complétées
- Chiffre d'affaires total
- Panier moyen
- Répartition par marketplace
- Répartition par pays

## 🎯 Exemples d'utilisation

### Exemple 1 : Données de base pour tests
```bash
python seed_sales_data.py
```
Génère : 200 commandes, 50 produits, 100 clients sur 6 mois

### Exemple 2 : Données volumineuses pour performance
```bash
python seed_sales_data.py --orders 1000 --products 200 --customers 500 --months 12
```
Génère : 1000 commandes sur 12 mois avec plus de produits et clients

### Exemple 3 : Réinitialiser et regénérer
```bash
python seed_sales_data.py --clear --orders 300
```
Supprime les données existantes et génère 300 nouvelles commandes

### Exemple 4 : Données récentes (1 mois)
```bash
python seed_sales_data.py --months 1 --orders 100
```
Génère 100 commandes sur le dernier mois uniquement

## ⚠️ Notes importantes

- Le script utilise des données aléatoires mais réalistes
- Les dates sont réparties uniformément sur la période spécifiée
- Les prix et marges sont calculés automatiquement
- Les commissions marketplace sont appliquées selon les taux définis
- Les clients peuvent avoir plusieurs commandes
- Les produits peuvent être vendus plusieurs fois

## 🔧 Dépannage

### Erreur : "Database connection failed"
Vérifiez que la base de données est accessible et que les variables d'environnement sont correctement configurées.

### Erreur : "Table does not exist"
Exécutez d'abord les migrations Alembic :
```bash
python -m poetry run alembic upgrade head
```

### Erreur : "Unique constraint violation"
Utilisez l'option `--clear` pour supprimer les données existantes avant de regénérer.

## 📝 Utilisation avec Recharts

Ces données sont parfaites pour tester les graphiques Recharts car elles incluent :
- ✅ Répartition par pays (pour graphiques géographiques)
- ✅ Répartition par marketplace (pour graphiques comparatifs)
- ✅ Évolution dans le temps (pour graphiques temporels)
- ✅ Données de marge et rentabilité (pour graphiques financiers)
- ✅ Données de produits et catégories (pour graphiques catégoriels)

