# Frontend - Dashboard Analytics

Application React avec TypeScript pour le Dashboard Analytics.

## 🚀 Démarrage

### Installation des dépendances

```bash
npm install
```

### Configuration

Créez un fichier `.env` à la racine du frontend :

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### Développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173` (ou le port indiqué par Vite).

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## 📁 Structure

```
src/
├── components/      # Composants réutilisables
│   ├── Navbar.tsx
│   └── ProtectedRoute.tsx
├── contexts/        # Contexts React
│   └── AuthContext.tsx
├── pages/           # Pages de l'application
│   ├── Login.tsx
│   ├── Register.tsx
│   └── Dashboard.tsx
├── services/        # Services API
│   ├── api.ts
│   └── authService.ts
└── main.tsx         # Point d'entrée
```

## 🔐 Authentification

L'application utilise JWT pour l'authentification. Le token est stocké dans `localStorage` et ajouté automatiquement aux requêtes API via les intercepteurs Axios.

## 🛣️ Routes

- `/login` - Page de connexion
- `/register` - Page d'inscription
- `/dashboard` - Dashboard principal (protégé)

## 📦 Dépendances principales

- **React** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - Client HTTP
- **React Hook Form** - Gestion de formulaires
- **Zod** - Validation de schémas

