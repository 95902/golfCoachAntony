# 🏌️ Golf Coach Booking System - Backend API

API REST pour le système de réservation de coaching de golf.

## 📚 Documentation API

### 🔓 Routes Publiques

#### Health Check
```
GET /health
```
Vérifie que l'API est opérationnelle.

**Réponse** :
```json
{
  "status": "ok",
  "timestamp": "2024-11-20T10:00:00.000Z",
  "service": "Golf Coach API",
  "version": "1.0.0"
}
```

---

#### Authentification

**Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "antony@golfcoach.com",
  "password": "Coach123!"
}
```

**Réponse** :
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "antony@golfcoach.com",
    "username": "antony",
    "role": "COACH"
  }
}
```

**Logout**
```
POST /api/auth/logout
```

**Get Current User**
```
GET /api/auth/me
```

---

#### Time Slots Disponibles

**Récupérer créneaux pour une date**
```
GET /api/time-slots/available?date=2024-11-20
```

**Réponse** :
```json
{
  "date": "2024-11-20",
  "available": true,
  "totalSlots": 9,
  "slots": [
    {
      "id": 1,
      "date": "2024-11-20",
      "startTime": "09:00",
      "endTime": "10:00",
      "isAvailable": true
    },
    ...
  ]
}
```

**Récupérer créneaux pour une plage de dates**
```
GET /api/time-slots/available-range?startDate=2024-11-20&endDate=2024-11-27
```

---

#### Créer une Réservation

**Réservation Indoor (1-3 créneaux d'1h)**
```
POST /api/bookings
Content-Type: application/json

{
  "type": "INDOOR",
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "phone": "0612345678",
  "date": "2024-11-20",
  "timeSlotIds": [1, 2, 3],
  "specialRequests": "Débutant, première fois sur simulateur"
}
```

**Réservation Parcours 9 Trous**
```
POST /api/bookings
Content-Type: application/json

{
  "type": "ACCOMPANIED_9",
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "phone": "0612345678",
  "date": "2024-11-25",
  "numberOfPlayers": 2,
  "courseId": 1,
  "specialRequests": "Niveau intermédiaire"
}
```

**Réservation Parcours 18 Trous**
```
POST /api/bookings
Content-Type: application/json

{
  "type": "ACCOMPANIED_18",
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "phone": "0612345678",
  "date": "2024-11-30",
  "numberOfPlayers": 3,
  "courseId": 2,
  "preferCallback": true
}
```

**Réponse** :
```json
{
  "message": "Booking created successfully",
  "booking": {
    "id": 1,
    "type": "INDOOR",
    "status": "CONFIRMED",
    "bookingDate": "2024-11-20",
    "startTime": "09:00",
    "endTime": "12:00",
    "totalPrice": 210,
    "customer": { ... },
    "timeSlots": [ ... ]
  }
}
```

---

### 🔒 Routes Authentifiées

Nécessitent une session active (cookie httpOnly).

#### Réservations

**Liste mes réservations** (utilisateur normal) / **Toutes les réservations** (coach/admin)
```
GET /api/bookings?page=1&limit=20&status=CONFIRMED&type=INDOOR&date=2024-11-20
```

**Détail d'une réservation**
```
GET /api/bookings/:id
```

**Modifier une réservation**
```
PUT /api/bookings/:id
Content-Type: application/json

{
  "date": "2024-11-21",
  "timeSlotIds": [4, 5],
  "specialRequests": "Changement de date"
}
```

**Annuler une réservation**
```
DELETE /api/bookings/:id
Content-Type: application/json

{
  "cancellationReason": "Empêchement de dernière minute"
}
```

---

#### Clients

**Liste des clients**
```
GET /api/customers?page=1&limit=20&search=dupont
```

**Détail d'un client**
```
GET /api/customers/:id
```

---

### 👑 Routes Admin (COACH ou ADMIN uniquement)

#### Gestion des Plannings

**Récupérer tous les plannings**
```
GET /api/admin/schedules
```

**Réponse** :
```json
{
  "week1": [
    {
      "dayOfWeek": 0,
      "dayName": "Lundi",
      "slots": [
        { "id": 1, "startTime": "09:00", "endTime": "12:00" },
        { "id": 2, "startTime": "14:00", "endTime": "18:00" }
      ],
      "isClosed": false
    },
    ...
  ],
  "week2": [ ... ]
}
```

**Ajouter une plage horaire**
```
POST /api/admin/schedules/slots
Content-Type: application/json

{
  "weekType": 1,
  "dayOfWeek": 0,
  "startTime": "09:00",
  "endTime": "12:00"
}
```

**Supprimer une plage horaire**
```
DELETE /api/admin/schedules/slots/:id
```

**Régénérer les créneaux (30 prochains jours)**
```
POST /api/admin/schedules/regenerate
Content-Type: application/json

{
  "daysAhead": 30
}
```

**Réponse** :
```json
{
  "message": "Time slots regenerated successfully",
  "generatedCount": 150,
  "daysAhead": 30
}
```

---

#### Gestion des Clients

**Créer un client**
```
POST /api/admin/customers
Content-Type: application/json

{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@example.com",
  "phone": "0612345678",
  "notes": "Client VIP"
}
```

**Modifier un client**
```
PUT /api/admin/customers/:id
Content-Type: application/json

{
  "phone": "0687654321",
  "notes": "Nouveau numéro"
}
```

**Supprimer un client**
```
DELETE /api/admin/customers/:id
```

---

## 🗃️ Seeders

Pour créer des données de test :

```bash
npm run db:seed
```

**Utilisateurs créés** :
- **Admin** : `admin@golfcoach.com` / `Admin123!`
- **Coach** : `antony@golfcoach.com` / `Coach123!`
- **User** : `user@test.com` / `User123!`

**Parcours créés** :
- Golf d'Omerson
- Golf Disneyland Paris
- Golf de Saint-Quentin-en-Yvelines
- Golf de Fontainebleau
- Golf de Courson

**Plannings créés** :
- **Semaine 1** : Lun-Mar, Jeu-Sam (Mer & Dim fermés)
- **Semaine 2** : Lun-Jeu, Sam (Ven & Dim fermés, Mer ouvert)

Ensuite, générer les créneaux :
```bash
# Via API (nécessite auth admin)
POST /api/admin/schedules/regenerate
```

---

## 🧪 Tests

### Test Manuel avec cURL

**1. Health Check**
```bash
curl http://localhost:3333/health
```

**2. Login**
```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"antony@golfcoach.com","password":"Coach123!"}'
```

**3. Récupérer créneaux disponibles**
```bash
curl "http://localhost:3333/api/time-slots/available?date=2024-11-20"
```

**4. Créer une réservation**
```bash
curl -X POST http://localhost:3333/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean@example.com",
    "phone": "0612345678",
    "date": "2024-11-20",
    "timeSlotIds": [1, 2]
  }'
```

---

## 📊 Logique Métier

### Réservations Indoor

- **Prix** : 70€ par créneau d'1h
- **Créneaux** : Minimum 1, maximum 3 consécutifs
- **Validation** : Les créneaux doivent se suivre sans trou
- **Exemple** :
  - 1 créneau (09:00-10:00) = 70€
  - 2 créneaux (09:00-11:00) = 140€
  - 3 créneaux (09:00-12:00) = 210€

### Réservations Parcours

**9 Trous** :
- Prix total : 180€ (divisé par nombre de joueurs)
- Durée : 4 heures
- Joueurs : 1 à 3
- Exemple : 2 joueurs = 90€/personne

**18 Trous** :
- Prix total : 300€ (divisé par nombre de joueurs)
- Durée : Journée entière
- **Bloque TOUTE la journée** (aucune autre réservation possible)
- Joueurs : 1 à 3
- Exemple : 3 joueurs = 100€/personne

### Plannings Cycliques

Le système alterne entre 2 plannings hebdomadaires :
- **Semaines impaires** (1, 3, 5...) : Planning Semaine 1
- **Semaines paires** (2, 4, 6...) : Planning Semaine 2

Chaque plage horaire (ex: 09:00-12:00) est automatiquement découpée en créneaux d'1h.

---

## 🔧 Services

### BookingService
- `createIndoorBooking()` : Logique réservation Indoor
- `createAccompaniedBooking()` : Logique réservation Parcours
- `updateBooking()` : Modification réservation
- `cancelBooking()` : Annulation réservation

### ScheduleService
- `generateTimeSlots(daysAhead)` : Génération automatique créneaux
- `createScheduleSlot()` : Ajouter plage horaire
- `deleteScheduleSlot()` : Supprimer plage horaire
- `getAllSchedules()` : Récupérer plannings Semaine 1 & 2

### N8nService
- `triggerBookingCreated()` : Webhook création réservation
- `triggerBookingUpdated()` : Webhook modification
- `triggerBookingCancelled()` : Webhook annulation
- `testWebhook()` : Test connexion N8N

---

## 🚀 Démarrage

1. **Créer la base de données** :
```bash
createdb golf_coach
```

2. **Lancer les migrations** :
```bash
npm run migration:run
```

3. **Créer les données de test** :
```bash
npm run db:seed
```

4. **Générer les créneaux (via API après login coach)** :
```bash
# Login puis appeler POST /api/admin/schedules/regenerate
```

5. **Démarrer le serveur** :
```bash
npm run dev
```

L'API sera accessible sur **http://localhost:3333**

---

## 📝 Logs & Debug

Tous les logs sont affichés dans la console :
- ✅ Webhooks N8N déclenchés
- ✅ Créneaux générés
- ❌ Erreurs de validation
- ❌ Erreurs serveur

---

## 🔐 Sécurité

- ✅ Mots de passe hashés automatiquement (Argon2)
- ✅ Sessions httpOnly cookies
- ✅ Validation stricte via VineJS
- ✅ CORS configuré pour frontend uniquement
- ✅ Middleware d'authentification
- ✅ Middleware d'autorisation admin
- ✅ Audit logs pour traçabilité

---

## 📚 Architecture

```
app/
├── controllers/       # HTTP Controllers
├── models/           # Lucid Models
├── services/         # Business Logic
├── validators/       # Vine Validators
└── middleware/       # Auth & Admin Middleware

database/
├── migrations/       # Database Migrations
└── seeders/         # Test Data Seeders
```

---

## 📞 Support

Pour toute question sur l'API, consultez le README principal du projet.
