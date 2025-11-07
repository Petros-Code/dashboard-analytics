# Installation de Poetry sur Windows

## Méthode 1 : Installation officielle (Recommandée)

### Option A : Via PowerShell (Recommandé)

Ouvrez PowerShell en tant qu'administrateur et exécutez :

```powershell
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -
```

Ou si vous avez Python 3.11+ installé :

```powershell
python -m pip install poetry
```

### Option B : Via le script d'installation

1. Téléchargez le script d'installation depuis : https://install.python-poetry.org
2. Exécutez-le dans PowerShell :
   ```powershell
   python install-poetry.py
   ```

### Option C : Via pip (Simple)

```bash
pip install poetry
```

## Vérification de l'installation

Après l'installation, vérifiez que Poetry fonctionne :

```bash
poetry --version
```

## Configuration du PATH (si nécessaire)

Si après l'installation, PowerShell ne trouve toujours pas Poetry, vous devrez peut-être ajouter Poetry au PATH.

Poetry s'installe généralement dans :
- `%APPDATA%\Python\Scripts\` ou
- `%USERPROFILE%\.local\bin\` ou
- `%LOCALAPPDATA%\Programs\Python\Python311\Scripts\`

Ajoutez ce chemin à votre variable d'environnement PATH Windows.

## Utilisation

### Si Poetry est dans le PATH

Une fois Poetry installé, dans le dossier `backend/`, exécutez :

```bash
cd backend
poetry install
```

### Si Poetry n'est PAS dans le PATH (Windows)

Utilisez `python -m poetry` à la place :

```bash
cd backend
python -m poetry install
```

Cela installera toutes les dépendances listées dans `pyproject.toml`.

### Régénérer le fichier lock

Si vous avez modifié `pyproject.toml` et que vous obtenez une erreur concernant `poetry.lock` :

```bash
python -m poetry lock
python -m poetry install
```

## Alternative : Utiliser pip directement

Si vous préférez ne pas utiliser Poetry, vous pouvez installer les dépendances avec pip :

```bash
cd backend
pip install fastapi uvicorn sqlalchemy alembic psycopg2-binary pydantic pydantic-settings python-multipart python-dotenv passlib bcrypt email-validator
```

Pour les dépendances de développement :
```bash
pip install pytest black flake8 mypy
```

