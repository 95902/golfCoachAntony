# Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [1.0.0] - 2024-11-15

### ✨ Features complètes

#### Backend
- **Setup initial AdonisJS 6**
  - Configuration TypeScript
  - Configuration PostgreSQL
  - Configuration CORS
  - Configuration session auth

- **Base de données (8 migrations)**
  - Table users (authentification + rôles)
  - Table customers (clients)
  - Table courses (parcours de golf)
  - Table weekly_schedules (planning cyclique)
  - Table schedule_slots (plages horaires)
  - Table time_slots (créneaux 1h)
  - Table bookings (réservations)
  - Table audit_logs (logs d'audit)

- **Modèles Lucid ORM (8 fichiers)**
  - Relations complètes entre les modèles
  - Méthodes helper (isCoach, canBeCancelled, etc.)
  - Hooks (beforeSave pour hashing mot de passe)

- **Controllers (6 fichiers)**
  - AuthController (login, register, logout, me)
  - BookingsController (CRUD complet avec autorisations)
  - CustomersController (CRUD admin)
  - TimeSlotsController (disponibilités)
  - SchedulesController (gestion plannings admin)
  - CoursesController (liste parcours)

- **Services métier (3 fichiers)**
  - BookingService
    - createIndoorBooking (validation créneaux consécutifs)
    - createAccompaniedBooking (9 ou 18 trous)
    - updateBooking
    - cancelBooking
    - Transactions DB pour atomicité
  - ScheduleService
    - Génération automatique créneaux
    - Système cyclique Semaine 1/2
    - Split plages horaires en créneaux 1h
  - N8nService
    - triggerBookingCreated
    - triggerBookingUpdated
    - triggerBookingCancelled
    - testWebhook

- **Validators VineJS (4 fichiers)**
  - BookingValidator (Indoor + Accompanied)
  - AuthValidator
  - CustomerValidator
  - ScheduleValidator

- **Seeders (3 fichiers)**
  - UserSeeder (admin, coach, user test)
  - CourseSeeder (5 parcours de golf)
  - WeeklyScheduleSeeder (planning semaine 1 et 2)

- **Routes API (20+ endpoints)**
  - Routes publiques (santé, auth, création réservation)
  - Routes authentifiées (gestion réservations)
  - Routes admin (planning, customers)

#### Frontend

- **Setup React 19 + Vite**
  - Configuration TypeScript
  - Configuration Tailwind CSS
  - Configuration Shadcn UI
  - Path aliases (@/*)

- **Pages (3 fichiers)**
  - Home : Landing page avec présentation
  - BookingIndoor : Wizard 4 étapes réservation Indoor
  - BookingAccompanied : Wizard 4 étapes réservation Parcours

- **Composants UI Shadcn (7 fichiers)**
  - Button (6 variants)
  - Card (avec sous-composants)
  - Input
  - Label
  - Badge (5 variants)
  - Alert (3 variants)
  - Select

- **Composants Booking Indoor (4 fichiers)**
  - CalendarPicker
    - Calendrier interactif
    - Limite 30 jours
    - Désactivation dates passées
  - TimeSlotPicker
    - Groupement matin/après-midi
    - Sélection 1-3 créneaux
    - **Validation créneaux consécutifs en temps réel**
    - Calcul prix dynamique (70€ × nombre de créneaux)
  - BookingForm
    - React Hook Form + Zod
    - Validation temps réel
    - Demandes spéciales
  - BookingSummary
    - Récapitulatif complet
    - Confirmation finale

- **Composants Booking Accompagné (6 fichiers)**
  - BookingTypeSelector
    - Cartes 9 vs 18 trous
    - Affichage durée et prix
    - Warning 18 trous (bloque journée)
  - CourseSelector
    - Dropdown parcours
    - Intégration API
    - Détails parcours sélectionné
  - PlayerSelector
    - Boutons +/- pour 1-3 joueurs
    - **Calcul prix par joueur dynamique**
    - Sélection rapide (Solo/Duo/Trio)
  - PriceDisplay
    - Sidebar prix
    - Breakdown détaillé
    - Liste inclusions
  - AccompaniedBookingForm
    - Formulaire client
    - **Date OU préférence rappel**
    - React Hook Form + Zod
  - AccompaniedSummary
    - Récapitulatif complet
    - Infos importantes

- **State Management Zustand (2 stores)**
  - bookingStore (Indoor)
    - Gestion étapes wizard
    - Sélection date/créneaux
    - Info client
    - Computed values (prix total)
  - accompaniedStore (Parcours)
    - Gestion étapes wizard
    - Type booking (9/18)
    - Parcours + joueurs
    - Date OU callback
    - Computed values (prix par joueur)

- **API Services (3 fichiers)**
  - api.ts (client Axios configuré)
  - bookings.ts (tous endpoints réservations)
  - courses.ts (liste parcours)

- **Types TypeScript**
  - Types complets pour toutes les entités
  - Types Request/Response API
  - Enums (BookingType, BookingStatus)

#### N8N Integration

- **Workflow complet exportable**
  - Fichier JSON prêt à importer
  - Webhook trigger configuré
  - Routing conditionnel (created/updated/cancelled)

- **Nodes configurés**
  - Webhook trigger
  - IF nodes (routing par type d'événement)
  - Set Variables (préparation données)
  - Gmail nodes (emails clients + coach)
  - Google Calendar nodes (sync événements)
  - Respond to Webhook

- **Templates emails HTML (4 templates)**
  - Email confirmation réservation
    - Design responsive
    - Support Indoor + Accompanied
    - Détails complets
    - Conseils importants
  - Email rappel 24h
    - Design orange (warning)
    - Conseils pratiques
    - Rappel météo pour parcours
  - Email annulation
    - Design rouge
    - CTA nouvelle réservation
  - Notification coach
    - Design bleu
    - Récapitulatif booking
    - Actions effectuées

- **Documentation N8N**
  - Guide complet installation (docs/N8N_SETUP.md)
    - 3 méthodes d'installation
    - Configuration credentials OAuth2
    - Import workflow
    - Tests
    - Dépannage
  - README workflow (n8n/README.md)
  - Templates HTML commentés

#### Documentation

- **README principal**
  - Description complète du projet
  - Guide d'installation détaillé
  - Structure du projet
  - Liste API endpoints
  - Guide de dépannage
  - Statistiques du projet
  - Roadmap

- **Backend README**
  - Documentation architecture backend
  - Explication des services
  - Schéma base de données

- **N8N Setup Guide**
  - 500+ lignes de documentation
  - Étapes pas à pas
  - Templates emails
  - Configuration avancée

### 🔧 Technical

- **Sécurité**
  - Hashing mots de passe (bcrypt)
  - Sessions httpOnly cookies
  - CORS configuré
  - Validation stricte (backend + frontend)
  - Transactions DB
  - Logs d'audit

- **Validation**
  - Backend: VineJS avec règles strictes
  - Frontend: Zod schemas + React Hook Form
  - Validation créneaux consécutifs
  - Validation business rules

- **Performance**
  - Indexes DB sur clés étrangères
  - Transactions pour atomicité
  - Pagination API
  - Lazy loading composants

### 📦 Commits

- `18cecb2` - feat: Setup complet Backend + Frontend - Golf Coach Booking System
- `6a8bf6e` - feat: Backend complet - Controllers, Services & Validators pour réservations Indoor
- `ac30068` - feat: Frontend complet - Interface de réservation Indoor
- `e5f0679` - feat: Complete Accompanied Booking (Parcours) interface
- `fb8f8e0` - feat: Complete N8N integration - Workflows & Documentation

### 📊 Statistiques v1.0.0

- **Commits** : 5
- **Fichiers Backend** : 33
- **Fichiers Frontend** : 28
- **Fichiers N8N** : 4
- **Lignes de code** : ~8000+
- **Migrations** : 8
- **Seeders** : 3
- **Controllers** : 6
- **Models** : 8
- **Services** : 3
- **Validators** : 4
- **Composants React** : 17
- **Pages** : 3
- **API Endpoints** : 20+

---

## [0.1.0] - 2024-11-15 (Initial Setup)

### Added
- Structure initiale du projet
- Configuration AdonisJS 6
- Configuration React 19 + Vite
- Setup base de données PostgreSQL
- Health check endpoint

---

## À venir

### [1.1.0] - Planifié
- Dashboard admin pour gestion réservations
- Statistiques et analytics
- Exports Excel/PDF

### [1.2.0] - Planifié
- Paiement en ligne (Stripe)
- Système de fidélité
- Abonnements

### [2.0.0] - Futur
- Application mobile (React Native)
- Multi-langue (FR/EN)
- Chat en direct avec le coach

---

**Convention de versioning :**
- MAJOR : Changements incompatibles de l'API
- MINOR : Ajout de fonctionnalités rétro-compatibles
- PATCH : Corrections de bugs rétro-compatibles
