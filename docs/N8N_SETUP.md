# Configuration N8N - Golf Coach Booking System

Ce guide explique comment configurer N8N pour automatiser les notifications par email et la synchronisation avec Google Calendar.

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Prérequis](#prérequis)
3. [Installation de N8N](#installation-de-n8n)
4. [Configuration des credentials](#configuration-des-credentials)
5. [Import du workflow](#import-du-workflow)
6. [Configuration du backend](#configuration-du-backend)
7. [Tests](#tests)
8. [Dépannage](#dépannage)

---

## Vue d'ensemble

Le système utilise N8N pour :

- ✉️ **Emails de confirmation** : Envoyés automatiquement à la création d'une réservation
- 📅 **Google Calendar** : Création/modification/suppression d'événements automatiques
- 🔔 **Rappels** : Emails de rappel 24h avant la séance
- 📊 **Notifications coach** : Alertes pour le coach sur les nouvelles réservations

### Architecture des webhooks

```
Backend (AdonisJS)
    ↓
    → Webhook POST /webhook/golf-coach
       ↓
    N8N Workflow
       ↓
    ├─→ Gmail (Emails clients)
    ├─→ Google Calendar (Événements)
    └─→ Gmail (Notifications coach)
```

### Types d'événements

- `booking.created` : Nouvelle réservation
- `booking.updated` : Modification de réservation
- `booking.cancelled` : Annulation de réservation

---

## Prérequis

- N8N installé (cloud ou self-hosted)
- Compte Gmail ou Google Workspace
- Accès à Google Calendar API
- API Google Cloud Project avec OAuth 2.0

---

## Installation de N8N

### Option 1 : N8N Cloud (Recommandé)

1. Créer un compte sur https://n8n.io
2. Se connecter au dashboard
3. Passer à l'étape suivante

### Option 2 : Installation locale avec Docker

```bash
# Installation avec Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Option 3 : Installation avec npm

```bash
npm install n8n -g
n8n start
```

Accéder à N8N : http://localhost:5678

---

## Configuration des credentials

### 1. Gmail OAuth2

**Étapes :**

1. **Créer un projet Google Cloud**
   - Aller sur https://console.cloud.google.com
   - Créer un nouveau projet : "Golf Coach N8N"
   - Activer l'API Gmail
   - Activer l'API Google Calendar

2. **Créer les credentials OAuth 2.0**
   - Aller dans "Credentials"
   - Créer "OAuth 2.0 Client ID"
   - Type : Application Web
   - Authorized redirect URIs :
     ```
     https://app.n8n.cloud/rest/oauth2-credential/callback
     # OU pour local:
     http://localhost:5678/rest/oauth2-credential/callback
     ```
   - Copier le Client ID et Client Secret

3. **Configurer dans N8N**
   - Aller dans "Credentials" → "Create New"
   - Choisir "Gmail OAuth2 API"
   - Renseigner :
     - Client ID : `votre_client_id`
     - Client Secret : `votre_client_secret`
     - Scopes : `https://www.googleapis.com/auth/gmail.send`
   - Cliquer sur "Connect my account"
   - Autoriser l'accès

### 2. Google Calendar OAuth2

**Étapes :**

1. Dans le même projet Google Cloud
2. Activer l'API Google Calendar
3. Créer une nouvelle credential dans N8N :
   - Type : "Google Calendar OAuth2 API"
   - Utiliser le même Client ID/Secret
   - Scopes : `https://www.googleapis.com/auth/calendar`
   - Connecter et autoriser

### 3. HTTP Header Auth (pour les webhooks sortants - optionnel)

Si vous voulez sécuriser les webhooks :

1. Générer un token secret :
   ```bash
   openssl rand -hex 32
   ```

2. Dans N8N, créer une credential "Header Auth"
   - Name : `x-webhook-token`
   - Value : `votre_token_généré`

---

## Import du workflow

### Méthode 1 : Import depuis fichier JSON

1. Télécharger le fichier `n8n/golf-coach-workflow.json`
2. Dans N8N, aller dans "Workflows"
3. Cliquer sur "Import from File"
4. Sélectionner `golf-coach-workflow.json`
5. Le workflow est importé avec tous les nodes configurés

### Méthode 2 : Import depuis URL (si workflow publié)

1. Copier l'URL du workflow
2. Dans N8N : "Import from URL"
3. Coller l'URL

### Méthode 3 : Création manuelle

Voir la section "Structure du workflow" ci-dessous pour créer manuellement.

---

## Configuration du backend

### 1. Activer le webhook

Une fois le workflow importé dans N8N :

1. Ouvrir le workflow "Golf Coach Booking System"
2. Cliquer sur le node "Webhook" (premier node)
3. Copier l'URL du webhook (format : `https://app.n8n.cloud/webhook/xxxxx`)

### 2. Configurer le backend

Éditer le fichier `.env` du backend :

```bash
# N8N Webhook URL
N8N_WEBHOOK_URL=https://app.n8n.cloud/webhook/xxxxx
```

### 3. Redémarrer le serveur backend

```bash
cd backend
npm run dev
```

### 4. Activer le workflow N8N

Dans N8N :
1. Ouvrir le workflow
2. Cliquer sur "Active" (en haut à droite)
3. Le workflow est maintenant actif

---

## Structure du workflow

### Node 1 : Webhook Trigger

- **Type** : Webhook
- **Method** : POST
- **Path** : `/golf-coach`
- **Response** : Immediately
- **Authentication** : None (ou Header Auth si sécurisé)

### Node 2 : Switch (Router)

Route selon `{{ $json.event }}` :
- Route 0 : `booking.created`
- Route 1 : `booking.updated`
- Route 2 : `booking.cancelled`

### Branche "booking.created"

#### Node 3a : Set Variables
Prépare les variables pour l'email :
- `customerName` : `{{ $json.customer.firstName }} {{ $json.customer.lastName }}`
- `customerEmail` : `{{ $json.customer.email }}`
- `bookingType` : `{{ $json.booking.type }}`
- `bookingDate` : `{{ $json.booking.bookingDate }}`
- `startTime` : `{{ $json.booking.startTime }}`
- `endTime` : `{{ $json.booking.endTime }}`
- `totalPrice` : `{{ $json.booking.totalPrice }}`

#### Node 3b : Gmail - Email Client
```
To: {{ $json.customerEmail }}
Subject: Confirmation de réservation - Golf Coach Antony
Body: Voir template ci-dessous
```

#### Node 3c : Google Calendar - Create Event
```
Calendar: Golf Coach
Summary: {{ $json.bookingType }} - {{ $json.customerName }}
Start: {{ $json.bookingDate }}T{{ $json.startTime }}
End: {{ $json.bookingDate }}T{{ $json.endTime }}
Description: Réservation #{{ $json.booking.id }}
```

#### Node 3d : Gmail - Notification Coach
```
To: coach@golfcoachantony.com
Subject: Nouvelle réservation
Body: Voir template
```

### Branche "booking.updated"

Similaire à "created" mais avec email de modification

### Branche "booking.cancelled"

- Supprime l'événement Google Calendar
- Envoie email d'annulation au client
- Notifie le coach

### Node final : Schedule Trigger (Rappels 24h)

- **Type** : Cron
- **Expression** : `0 10 * * *` (tous les jours à 10h)
- **Timezone** : Europe/Paris

Logique :
1. Chercher les réservations de demain
2. Envoyer email de rappel

---

## Templates d'emails

### Email de confirmation (booking.created)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #16a34a; color: white; padding: 20px; text-align: center; }
    .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
    .details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #16a34a; }
    .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
    .button { display: inline-block; background: #16a34a; color: white; padding: 12px 24px;
              text-decoration: none; border-radius: 5px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏌️ Golf Coach Antony</h1>
      <p>Confirmation de réservation</p>
    </div>

    <div class="content">
      <p>Bonjour <strong>{{ $json.customer.firstName }}</strong>,</p>

      <p>Votre réservation a bien été enregistrée ! Voici les détails :</p>

      <div class="details">
        <h3>Détails de la réservation</h3>
        <p><strong>Type :</strong>
          {{#if (eq $json.booking.type "INDOOR") }}
            Séance Indoor (TrackMan 4)
          {{else if (eq $json.booking.type "ACCOMPANIED_9") }}
            Parcours Accompagné - 9 Trous
          {{else}}
            Parcours Accompagné - 18 Trous
          {{/if}}
        </p>
        <p><strong>Date :</strong> {{ $json.booking.bookingDate | formatDate }}</p>
        <p><strong>Horaire :</strong> {{ $json.booking.startTime }} - {{ $json.booking.endTime }}</p>

        {{#if $json.booking.course }}
        <p><strong>Parcours :</strong> {{ $json.booking.course.name }}</p>
        <p><strong>Lieu :</strong> {{ $json.booking.course.location }}</p>
        {{/if}}

        {{#if $json.booking.numberOfPlayers }}
        <p><strong>Nombre de joueurs :</strong> {{ $json.booking.numberOfPlayers }}</p>
        {{/if}}

        <p><strong>Prix total :</strong> {{ $json.booking.totalPrice }}€</p>

        {{#if $json.booking.specialRequests }}
        <p><strong>Demandes spéciales :</strong> {{ $json.booking.specialRequests }}</p>
        {{/if}}
      </div>

      <p><strong>📧 Important :</strong></p>
      <ul>
        <li>Un rappel vous sera envoyé 24h avant votre séance</li>
        <li>Annulation gratuite jusqu'à 48h avant</li>
        <li>Merci d'arriver 10 minutes en avance</li>
      </ul>

      <p>À très bientôt sur le green ! ⛳</p>

      <p>L'équipe Golf Coach Antony</p>
    </div>

    <div class="footer">
      <p>© 2024 Golf Coach Antony - Tous droits réservés</p>
      <p>Email : contact@golfcoachantony.com | Tél : 06 XX XX XX XX</p>
    </div>
  </div>
</body>
</html>
```

### Email de rappel (24h avant)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    /* Même style que ci-dessus */
  </style>
</head>
<body>
  <div class="container">
    <div class="header" style="background: #f59e0b;">
      <h1>🔔 Rappel - Votre séance demain</h1>
    </div>

    <div class="content">
      <p>Bonjour <strong>{{ $json.customer.firstName }}</strong>,</p>

      <p>Votre séance de golf a lieu <strong>demain</strong> !</p>

      <div class="details">
        <h3>Rappel de votre réservation</h3>
        <p><strong>Date :</strong> {{ $json.booking.bookingDate | formatDate }}</p>
        <p><strong>Horaire :</strong> {{ $json.booking.startTime }}</p>
        <p><strong>Durée :</strong> {{ $json.booking.durationMinutes }} minutes</p>
      </div>

      <p><strong>💡 Conseils :</strong></p>
      <ul>
        <li>Arrivez 10 minutes en avance</li>
        <li>Prévoyez une tenue confortable</li>
        <li>N'oubliez pas vos chaussures de golf</li>
      </ul>

      <p>Au plaisir de vous voir demain !</p>

      <p>L'équipe Golf Coach Antony</p>
    </div>
  </div>
</body>
</html>
```

### Email d'annulation

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    /* Même style */
  </style>
</head>
<body>
  <div class="container">
    <div class="header" style="background: #dc2626;">
      <h1>❌ Annulation de réservation</h1>
    </div>

    <div class="content">
      <p>Bonjour <strong>{{ $json.customer.firstName }}</strong>,</p>

      <p>Votre réservation a bien été annulée.</p>

      <div class="details">
        <h3>Réservation annulée</h3>
        <p><strong>Type :</strong> {{ $json.booking.type }}</p>
        <p><strong>Date :</strong> {{ $json.booking.bookingDate }}</p>
        <p><strong>Horaire :</strong> {{ $json.booking.startTime }} - {{ $json.booking.endTime }}</p>
      </div>

      <p>Vous pouvez réserver une nouvelle séance à tout moment sur notre site.</p>

      <a href="https://golfcoachantony.com/booking/indoor" class="button">
        Nouvelle réservation
      </a>

      <p>À bientôt !</p>

      <p>L'équipe Golf Coach Antony</p>
    </div>
  </div>
</body>
</html>
```

---

## Tests

### Test manuel du webhook

```bash
# Test depuis le terminal
curl -X POST https://app.n8n.cloud/webhook/xxxxx \
  -H "Content-Type: application/json" \
  -d '{
    "event": "booking.created",
    "booking": {
      "id": 999,
      "type": "INDOOR",
      "bookingDate": "2024-12-01",
      "startTime": "14:00:00",
      "endTime": "15:00:00",
      "totalPrice": 70,
      "status": "PENDING"
    },
    "customer": {
      "firstName": "Test",
      "lastName": "User",
      "email": "test@example.com",
      "phone": "0612345678"
    },
    "metadata": {
      "timestamp": "2024-11-15T10:00:00Z",
      "bookingType": "INDOOR"
    }
  }'
```

### Test depuis le backend

```bash
# Dans le backend
cd backend
node ace tinker

# Dans le REPL
const N8nService = (await import('#services/n8n_service')).default
await N8nService.testWebhook()
```

### Vérifications

- ✅ Webhook reçu dans N8N (vérifier les exécutions)
- ✅ Email reçu par le client
- ✅ Événement créé dans Google Calendar
- ✅ Email de notification envoyé au coach

---

## Dépannage

### Problème : Webhook non reçu

**Solutions :**
1. Vérifier que le workflow est ACTIF dans N8N
2. Vérifier l'URL du webhook dans `.env`
3. Vérifier les logs du backend : `console.log('N8N webhook triggered')`
4. Tester avec curl (voir section Tests)

### Problème : Emails non envoyés

**Solutions :**
1. Vérifier les credentials Gmail OAuth2
2. Re-connecter le compte Gmail
3. Vérifier les quotas Gmail (max 500 emails/jour)
4. Vérifier les logs d'exécution dans N8N

### Problème : Google Calendar ne se met pas à jour

**Solutions :**
1. Vérifier les credentials Google Calendar
2. Vérifier que l'API est activée dans Google Cloud
3. Re-connecter le compte
4. Vérifier le nom du calendrier dans le node

### Problème : Rappels non envoyés

**Solutions :**
1. Vérifier que le Schedule Trigger est actif
2. Vérifier la timezone (Europe/Paris)
3. Vérifier la requête vers la base de données
4. Tester manuellement le node Schedule

### Logs et debugging

Dans N8N :
1. Cliquer sur "Executions" dans le menu
2. Voir l'historique des exécutions
3. Cliquer sur une exécution pour voir le détail
4. Vérifier les données à chaque étape

Dans le backend :
```bash
# Voir les logs en temps réel
cd backend
npm run dev
# Les webhooks sont loggés dans la console
```

---

## Configuration avancée

### Sécuriser le webhook

Ajouter une authentification :

1. Dans N8N, modifier le node Webhook
2. Activer "Header Auth"
3. Ajouter un header `x-webhook-token`

4. Dans le backend, modifier `n8n_service.ts` :
```typescript
await axios.post(this.webhookUrl, payload, {
  headers: {
    'Content-Type': 'application/json',
    'x-webhook-token': env.get('N8N_WEBHOOK_TOKEN')
  }
})
```

### Personnaliser les templates

Les templates sont stockés dans les nodes Gmail. Pour les modifier :
1. Ouvrir le workflow
2. Cliquer sur le node Gmail
3. Modifier le "Email Body (HTML)"

### Ajouter d'autres intégrations

N8N supporte 400+ applications :
- Slack : Notifications dans un channel
- SMS (Twilio) : Rappels par SMS
- Notion : Logging des réservations
- Webhook sortant : Intégration avec d'autres systèmes

---

## Support

Pour toute question :
- Documentation N8N : https://docs.n8n.io
- Community : https://community.n8n.io
- Support projet : Créer une issue sur le repo GitHub

---

**Dernière mise à jour** : 15 novembre 2024
**Version** : 1.0.0
