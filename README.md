# 🏌️ Golf Coach Booking System

Système de réservation en ligne pour coach de golf professionnel.

## 📋 Stack Technique

### Backend
- **Framework**: AdonisJS 6 (TypeScript)
- **Database**: PostgreSQL 14+
- **ORM**: Lucid (intégré AdonisJS)
- **Authentication**: Sessions (httpOnly cookies)
- **Validation**: Vine
- **Port**: 3333

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **UI Library**: Shadcn UI + Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Port**: 5173

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 20+
- PostgreSQL 14+
- npm ou yarn

### 1. Installation

```bash
# Cloner le repository
git clone <repo-url>
cd golfCoachAntony

# Installer les dépendances Backend
cd backend
npm install

# Installer les dépendances Frontend
cd ../frontend
npm install
```

### 2. Configuration Backend

```bash
cd backend

# Le fichier .env est déjà créé
# Modifier les variables si nécessaire
nano .env
```

**Variables d'environnement importantes** :
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=golf_coach

# CORS (Frontend URL)
CORS_ORIGIN=http://localhost:5173
```

### 3. Configuration Base de Données

```bash
# Créer la base de données PostgreSQL
createdb golf_coach

# OU via psql
psql -U postgres
CREATE DATABASE golf_coach;
\q

# Lancer les migrations
cd backend
npm run migration:run
```

### 4. Démarrage des Serveurs

**Terminal 1 - Backend** :
```bash
cd backend
npm run dev
```
Le backend sera accessible sur http://localhost:3333

**Terminal 2 - Frontend** :
```bash
cd frontend
npm run dev
```
Le frontend sera accessible sur http://localhost:5173

### 5. Vérification

Ouvrez http://localhost:5173 dans votre navigateur.

Vous devriez voir une page de test avec un health check qui confirme :
- ✅ Frontend opérationnel
- ✅ Backend opérationnel
- ✅ Communication Frontend ↔ Backend fonctionnelle

## 📊 Structure de la Base de Données

### Tables Principales

- **users** : Comptes utilisateurs (CLIENT, USER, COACH, ADMIN)
- **customers** : Clients (infos de réservation)
- **courses** : Parcours de golf
- **bookings** : Réservations (INDOOR, ACCOMPANIED_9, ACCOMPANIED_18)
- **time_slots** : Créneaux d'1h disponibles
- **weekly_schedules** : Plannings hebdomadaires cycliques (Semaine 1 / Semaine 2)
- **schedule_slots** : Plages horaires par planning
- **audit_logs** : Logs d'audit

## 🎯 Fonctionnalités Principales (MVP)

### Phase 1 - En cours
- [x] Setup complet Backend + Frontend
- [x] Configuration base de données
- [x] Migrations et Models
- [x] Health check endpoint
- [ ] Réservations Indoor (1-3 créneaux × 70€)
- [ ] Dashboard Coach basique
- [ ] Gestion plannings hebdomadaires cycliques
- [ ] Génération automatique créneaux

### Phase 2 - À venir
- [ ] Réservations Parcours (9 et 18 trous)
- [ ] Email confirmation automatique
- [ ] Synchronisation Google Calendar

### Phase 3 - À venir
- [ ] Dashboard avancé avec statistiques
- [ ] Exports Excel/PDF
- [ ] Optimisations performances

## 🔧 Scripts Utiles

### Backend

```bash
# Développement
npm run dev

# Build production
npm run build
npm run start

# Migrations
npm run migration:run
npm run migration:rollback

# Seeders
npm run db:seed

# CLI AdonisJS
npm run ace <command>
```

### Frontend

```bash
# Développement
npm run dev

# Build production
npm run build

# Preview production
npm run preview
```

## 📁 Structure du Projet

```
golfCoachAntony/
├── backend/                    # Backend AdonisJS
│   ├── app/
│   │   ├── controllers/        # Contrôleurs HTTP
│   │   ├── models/            # Models Lucid
│   │   ├── services/          # Logique métier
│   │   ├── validators/        # Validation Vine
│   │   └── middleware/        # Middleware custom
│   ├── config/                # Configuration
│   ├── database/
│   │   ├── migrations/        # Migrations DB
│   │   └── seeders/           # Seeders
│   ├── start/                 # Bootstrap
│   │   ├── routes.ts          # Routes API
│   │   └── env.ts             # Variables d'env
│   └── .env                   # Variables d'environnement
│
└── frontend/                   # Frontend React
    ├── src/
    │   ├── components/        # Composants React
    │   │   ├── ui/           # Composants UI (Shadcn)
    │   │   ├── layout/       # Layout components
    │   │   ├── booking/      # Composants réservation
    │   │   └── dashboard/    # Composants dashboard
    │   ├── pages/            # Pages
    │   ├── services/         # API client
    │   ├── stores/           # Zustand stores
    │   ├── hooks/            # Custom hooks
    │   ├── lib/              # Utilitaires
    │   └── types/            # Types TypeScript
    └── .env                  # Variables d'environnement
```

## 🐛 Debugging

### Backend ne démarre pas
```bash
# Vérifier PostgreSQL
psql -U postgres -l

# Vérifier les logs
cd backend
npm run dev
```

### Frontend ne peut pas se connecter au backend
1. Vérifier que le backend tourne sur http://localhost:3333
2. Vérifier CORS dans `backend/.env` :
   ```
   CORS_ORIGIN=http://localhost:5173
   ```
3. Vérifier l'URL de l'API dans `frontend/.env` :
   ```
   VITE_API_URL=http://localhost:3333
   ```

### Erreurs de migrations
```bash
# Rollback et relancer
cd backend
npm run migration:rollback
npm run migration:run
```

## 📝 Prochaines Étapes

1. **Créer les Controllers** :
   - BookingsController
   - CustomersController
   - TimeSlotsController
   - SchedulesController
   - AuthController

2. **Créer les Services** :
   - BookingService (logique réservations)
   - ScheduleService (génération créneaux)
   - N8nService (webhooks)
   - CalendarService (Google Calendar)

3. **Créer les Validators** :
   - CreateBookingValidator
   - UpdateBookingValidator
   - LoginValidator

4. **Créer les Pages Frontend** :
   - Page réservation Indoor
   - Dashboard Coach
   - Gestion plannings

## 📚 Documentation

- [AdonisJS Docs](https://docs.adonisjs.com)
- [React Docs](https://react.dev)
- [Shadcn UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

## 🤝 Contribution

Ce projet est en développement actif. Suivez les conventions de code définies dans le cahier des charges.

## 📄 License

ISC
