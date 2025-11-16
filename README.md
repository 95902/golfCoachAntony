# 🏌️ Golf Coach Antony - Système de Réservation

## 📋 Description

Système de réservation complet pour Golf Coach Antony permettant de gérer les réservations de séances Indoor (simulateur TrackMan 4) et de parcours accompagnés (9/18 trous).

**Stack technique :**
- **Backend** : AdonisJS 6 + PostgreSQL 14
- **Frontend** : React 19 + Vite + TypeScript + Shadcn UI
- **Automation** : N8N (emails + Google Calendar)
- **État** : Zustand
- **Validation** : VineJS (backend) + Zod (frontend)

---

## 🚀 Fonctionnalités

### ✅ Réservations Indoor
- Simulateur TrackMan 4
- Créneaux d'1 heure à 70€
- 1 à 3 créneaux consécutifs maximum
- Validation de créneaux consécutifs
- Confirmation immédiate par email

### ✅ Réservations Parcours Accompagné
- **9 Trous** : 180€ / 4 heures
- **18 Trous** : 300€ / journée complète
- 1 à 3 joueurs (prix divisé entre joueurs)
- Sélection du parcours de golf
- Date précise OU demande de rappel

### ✅ Gestion des horaires
- Système de planning cyclique (Semaine 1 / Semaine 2)
- Génération automatique des créneaux
- Disponibilité en temps réel
- Blocage automatique des créneaux réservés

### ✅ Automatisation N8N
- Emails de confirmation automatiques
- Rappels 24h avant la séance
- Synchronisation Google Calendar
- Notifications au coach
- Emails d'annulation

### ✅ Authentification & Autorisations
- Session-based auth avec cookies httpOnly
- Rôles : CLIENT, USER, COACH, ADMIN
- Gestion des permissions par rôle
- Réservations publiques (sans compte)

### ✅ Audit & Sécurité
- Logs d'audit pour toutes les actions
- Transactions de base de données
- Validation stricte des données (backend + frontend)
- CORS configuré
- Protection CSRF

---

## 📁 Structure du projet

```
golfCoachAntony/
├── backend/              # Backend AdonisJS 6
│   ├── app/
│   │   ├── controllers/  # Contrôleurs API (6 fichiers)
│   │   ├── models/       # Modèles Lucid ORM (8 fichiers)
│   │   ├── services/     # Services métier (3 fichiers)
│   │   └── validators/   # Validateurs VineJS (4 fichiers)
│   ├── database/
│   │   ├── migrations/   # 8 migrations
│   │   └── seeders/      # 3 seeders
│   ├── config/           # Configuration app
│   └── start/            # Routes & bootstrap
│
├── frontend/             # Frontend React 19
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/       # Shadcn UI (7 composants)
│   │   │   └── booking/  # Composants booking (10 fichiers)
│   │   ├── pages/        # Pages (3 fichiers)
│   │   ├── services/     # API clients (3 fichiers)
│   │   ├── stores/       # Zustand stores (2 fichiers)
│   │   └── types/        # TypeScript types
│   └── public/
│
├── n8n/                  # Workflows N8N
│   ├── golf-coach-workflow.json
│   ├── email-templates.html
│   └── README.md
│
└── docs/                 # Documentation
    └── N8N_SETUP.md
```

---

## 🛠️ Installation

### Prérequis

- Node.js 20+
- PostgreSQL 14+
- npm ou yarn
- (Optionnel) N8N pour l'automatisation

### Backend

```bash
# 1. Aller dans le dossier backend
cd backend

# 2. Installer les dépendances
npm install

# 3. Copier le fichier .env
cp .env.example .env

# 4. Générer une clé d'application
node ace generate:key

# 5. Configurer la base de données dans .env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=golf_coach

# 6. Créer la base de données
createdb golf_coach

# 7. Exécuter les migrations
node ace migration:run

# 8. (Optionnel) Lancer les seeders
node ace db:seed

# 9. Démarrer le serveur
npm run dev
```

Le backend sera disponible sur http://localhost:3333

### Frontend

```bash
# 1. Aller dans le dossier frontend
cd frontend

# 2. Installer les dépendances
npm install

# 3. Démarrer le serveur de dev
npm run dev
```

Le frontend sera disponible sur http://localhost:5173

### N8N (Optionnel)

Voir le guide complet : [docs/N8N_SETUP.md](docs/N8N_SETUP.md)

**Résumé rapide :**
1. Créer un compte sur https://n8n.io
2. Importer le workflow `n8n/golf-coach-workflow.json`
3. Configurer les credentials Gmail et Google Calendar
4. Copier l'URL du webhook dans `.env` : `N8N_WEBHOOK_URL=...`
5. Activer le workflow

---

## 🗄️ Base de données

### Schéma

**8 tables principales :**
- `users` : Utilisateurs avec authentification
- `customers` : Clients (liés ou non à un user)
- `courses` : Parcours de golf disponibles
- `weekly_schedules` : Planning cyclique (Semaine 1/2)
- `schedule_slots` : Plages horaires par jour
- `time_slots` : Créneaux d'1h générés automatiquement
- `bookings` : Réservations
- `audit_logs` : Logs d'audit

### Seeders disponibles

```bash
# Users (admin, coach, user test)
node ace db:seed --files database/seeders/user_seeder.ts

# Parcours de golf (5 parcours)
node ace db:seed --files database/seeders/course_seeder.ts

# Planning semaines 1 et 2
node ace db:seed --files database/seeders/weekly_schedule_seeder.ts
```

---

## 🔌 API Endpoints

### Authentification
```
POST   /api/auth/login        # Connexion
POST   /api/auth/register     # Inscription
POST   /api/auth/logout       # Déconnexion
GET    /api/auth/me           # Utilisateur actuel
```

### Réservations
```
GET    /api/bookings          # Liste (auth)
GET    /api/bookings/:id      # Détail (auth)
POST   /api/bookings          # Créer (public)
PUT    /api/bookings/:id      # Modifier (auth)
DELETE /api/bookings/:id      # Annuler (auth)
```

### Créneaux horaires
```
GET    /api/time-slots/available              # Créneaux dispo pour une date
GET    /api/time-slots/available-range        # Créneaux sur période
```

### Parcours
```
GET    /api/courses           # Liste des parcours
GET    /api/courses/:id       # Détail parcours
```

### Clients (Auth requise)
```
GET    /api/customers         # Liste
GET    /api/customers/:id     # Détail
POST   /api/customers         # Créer
PUT    /api/customers/:id     # Modifier
DELETE /api/customers/:id     # Supprimer
```

### Admin (Auth ADMIN requise)
```
GET    /api/admin/schedules              # Planning
POST   /api/admin/schedules/:id/slots    # Ajouter créneau
DELETE /api/admin/schedules/:id/slots    # Supprimer créneau
POST   /api/admin/schedules/regenerate   # Regénérer créneaux
```

---

## 🎨 Frontend - Pages & Composants

### Pages
- **Home** (`/`) : Page d'accueil avec présentation des services
- **BookingIndoor** (`/booking/indoor`) : Réservation Indoor (4 étapes)
- **BookingAccompanied** (`/booking/accompanied`) : Réservation Parcours (4 étapes)

### Composants UI (Shadcn)
- Button, Card, Input, Label, Badge, Alert, Select

### Composants Booking
**Indoor :**
- CalendarPicker : Sélection de date
- TimeSlotPicker : Sélection de créneaux (1-3 consécutifs)
- BookingForm : Formulaire client
- BookingSummary : Récapitulatif

**Parcours Accompagné :**
- BookingTypeSelector : Choix 9 ou 18 trous
- CourseSelector : Sélection du parcours
- PlayerSelector : Nombre de joueurs (1-3)
- PriceDisplay : Affichage dynamique des prix
- AccompaniedBookingForm : Formulaire + date/callback
- AccompaniedSummary : Récapitulatif

---

## 📧 Emails automatiques (N8N)

### Templates disponibles
1. **Confirmation de réservation** : Envoyé immédiatement après création
2. **Rappel 24h** : Envoyé automatiquement 24h avant la séance
3. **Annulation** : Envoyé lors de l'annulation
4. **Notification coach** : Envoyé au coach pour chaque réservation

Tous les templates sont **responsive** et **professionnels**.

---

## 🧪 Tests

### Test manuel du backend

```bash
# Vérifier la santé de l'API
curl http://localhost:3333/health

# Créer une réservation Indoor
curl -X POST http://localhost:3333/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "type": "INDOOR",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean@example.com",
    "phone": "0612345678",
    "date": "2024-12-01",
    "timeSlotIds": [1, 2]
  }'
```

### Test du webhook N8N

```bash
# Tester le webhook (remplacer l'URL)
curl -X POST https://app.n8n.cloud/webhook/xxxxx \
  -H "Content-Type: application/json" \
  -d '{
    "event": "booking.created",
    "booking": {...},
    "customer": {...}
  }'
```

---

## 🔐 Sécurité

### Implémenté
- ✅ Validation stricte des données (backend + frontend)
- ✅ Sessions avec cookies httpOnly
- ✅ CORS configuré
- ✅ Hashing des mots de passe (bcrypt)
- ✅ Transactions de base de données
- ✅ Logs d'audit
- ✅ Autorisations par rôle

### À configurer en production
- [ ] HTTPS obligatoire
- [ ] Rate limiting
- [ ] Variables d'environnement sécurisées
- [ ] Backup automatique de la base de données
- [ ] Monitoring et alertes

---

## 📖 Documentation

- [Guide N8N complet](docs/N8N_SETUP.md) : Configuration N8N
- [README Backend](backend/README.md) : Documentation backend
- [README N8N](n8n/README.md) : Import workflow

---

## 🚢 Déploiement

### Backend (Production)

```bash
# Build
npm run build

# Migrations en production
NODE_ENV=production node ace migration:run --force

# Démarrer
NODE_ENV=production node build/bin/server.js
```

### Frontend (Production)

```bash
# Build
npm run build

# Les fichiers sont dans dist/
# Déployer sur Vercel, Netlify, ou serveur statique
```

### Variables d'environnement

**Backend (.env) :**
```env
NODE_ENV=production
PORT=3333
APP_KEY=<générer avec node ace generate:key>

DB_HOST=<db host>
DB_PORT=5432
DB_USER=<db user>
DB_PASSWORD=<db password>
DB_DATABASE=golf_coach

CORS_ORIGIN=https://votre-domaine.com
N8N_WEBHOOK_URL=<webhook N8N>
```

**Frontend (.env) :**
```env
VITE_API_URL=https://api.votre-domaine.com
```

---

## 👥 Comptes par défaut (après seeders)

```
Admin:
  Email: admin@golfcoach.com
  Password: admin123

Coach:
  Email: coach@golfcoach.com
  Password: coach123

User test:
  Email: user@example.com
  Password: user123
```

**⚠️ Changez ces mots de passe en production !**

---

## 🐛 Dépannage

### Le backend ne démarre pas
- Vérifier PostgreSQL est démarré
- Vérifier les credentials dans `.env`
- Vérifier que la base existe : `psql -l`

### Les créneaux ne s'affichent pas
- Vérifier que les seeders ont été exécutés
- Générer les créneaux : `node ace db:seed --files database/seeders/weekly_schedule_seeder.ts`
- Puis régénérer : appeler `/api/admin/schedules/regenerate`

### N8N ne reçoit pas les webhooks
- Vérifier que le workflow est ACTIF
- Vérifier l'URL dans `.env`
- Vérifier les logs backend : `console.log('N8N webhook triggered')`

### Emails non envoyés
- Vérifier les credentials Gmail dans N8N
- Re-connecter le compte Gmail OAuth2
- Vérifier les quotas Gmail (max 500/jour)

---

## 📊 Statistiques du projet

- **Backend** : 8 modèles, 6 contrôleurs, 3 services, 8 migrations
- **Frontend** : 3 pages, 17 composants, 2 stores
- **API** : 20+ endpoints
- **N8N** : 1 workflow complet, 4 templates emails
- **Documentation** : 3 fichiers README, 1 guide complet

---

## 🎯 Statut des fonctionnalités

### Phase 1 - ✅ Complète
- [x] Setup complet Backend + Frontend
- [x] Configuration base de données (8 migrations)
- [x] Modèles et relations Lucid ORM
- [x] Authentification et autorisations
- [x] Health check endpoint
- [x] Backend Controllers (6 fichiers)
- [x] Services métier (3 fichiers)
- [x] Validators VineJS (4 fichiers)

### Phase 2 - ✅ Complète
- [x] **Réservations Indoor** (TrackMan 4)
  - [x] Wizard 4 étapes
  - [x] Sélection date (calendrier 30 jours)
  - [x] Sélection créneaux (1-3 consécutifs)
  - [x] Validation créneaux consécutifs
  - [x] Formulaire client (React Hook Form + Zod)
  - [x] Récapitulatif et confirmation
  - [x] Écran de succès

### Phase 3 - ✅ Complète
- [x] **Réservations Parcours Accompagné**
  - [x] Choix 9 ou 18 trous
  - [x] Sélection parcours de golf
  - [x] Choix joueurs (1-3)
  - [x] Calcul prix dynamique (prix ÷ joueurs)
  - [x] Date OU préférence rappel
  - [x] Wizard 4 étapes
  - [x] Écran de succès

### Phase 4 - ✅ Complète
- [x] **Intégration N8N**
  - [x] Service N8N (webhooks)
  - [x] Workflow complet exportable
  - [x] Email confirmation (HTML responsive)
  - [x] Email rappel 24h
  - [x] Email annulation
  - [x] Notification coach
  - [x] Google Calendar sync
  - [x] Documentation complète

### Phase 5 - À venir
- [ ] Dashboard admin
- [ ] Paiement en ligne (Stripe)
- [ ] Système de fidélité
- [ ] App mobile
- [ ] Statistiques et analytics

---

## 📝 Licence

© 2024 Golf Coach Antony - Tous droits réservés

---

## 🤝 Support

Pour toute question :
- Email : contact@golfcoachantony.com
- Téléphone : 06 XX XX XX XX

---

**Projet développé avec ❤️ pour Golf Coach Antony**

Version : 1.0.0
Dernière mise à jour : 15 novembre 2024
