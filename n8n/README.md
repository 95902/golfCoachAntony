# N8N Workflow - Golf Coach Booking System

Ce dossier contient le workflow N8N prêt à importer pour automatiser les notifications et la gestion du calendrier.

## 📁 Fichiers

- `golf-coach-workflow.json` : Workflow N8N complet (à importer)
- `README.md` : Ce fichier

## 🚀 Installation rapide

### 1. Importer le workflow

1. Ouvrir N8N (https://n8n.io ou votre instance locale)
2. Aller dans "Workflows"
3. Cliquer sur "Import from File"
4. Sélectionner `golf-coach-workflow.json`
5. Le workflow s'ouvre automatiquement

### 2. Configurer les credentials

Le workflow nécessite 2 credentials :

#### Gmail OAuth2
1. Dans N8N : "Credentials" → "Create New" → "Gmail OAuth2 API"
2. Suivre les instructions pour connecter votre compte Gmail
3. Autoriser l'accès

#### Google Calendar OAuth2
1. Dans N8N : "Credentials" → "Create New" → "Google Calendar OAuth2 API"
2. Suivre les instructions pour connecter votre compte Google
3. Autoriser l'accès

### 3. Récupérer l'URL du webhook

1. Ouvrir le workflow importé
2. Cliquer sur le node "Webhook - Booking Events" (premier node)
3. Copier l'URL du webhook (format : `https://app.n8n.cloud/webhook/xxxxx`)

### 4. Configurer le backend

Éditer le fichier `.env` du backend :

```bash
N8N_WEBHOOK_URL=https://app.n8n.cloud/webhook/xxxxx
```

### 5. Activer le workflow

1. Dans N8N, cliquer sur "Active" (en haut à droite)
2. Le workflow est maintenant actif ! ✅

## 📊 Structure du workflow

```
Webhook Trigger
    ↓
IF Created / IF Updated / IF Cancelled
    ↓
Set Variables
    ↓
├─→ Gmail - Email Client
├─→ Google Calendar - Create/Update/Delete
└─→ Gmail - Notification Coach
    ↓
Respond to Webhook
```

## 🧪 Test

Tester le workflow avec curl :

```bash
curl -X POST https://app.n8n.cloud/webhook/xxxxx \
  -H "Content-Type: application/json" \
  -d '{
    "event": "booking.created",
    "booking": {
      "id": 1,
      "type": "INDOOR",
      "bookingDate": "2024-12-01",
      "startTime": "14:00:00",
      "endTime": "15:00:00",
      "totalPrice": 70
    },
    "customer": {
      "firstName": "Test",
      "lastName": "User",
      "email": "test@example.com",
      "phone": "0612345678"
    }
  }'
```

Vérifier :
- ✅ Email reçu par le client
- ✅ Événement créé dans Google Calendar
- ✅ Email de notification envoyé au coach

## 📧 Emails configurés

Le workflow envoie automatiquement :

### À la création (`booking.created`)
- ✉️ Email de confirmation au client
- 📅 Événement Google Calendar créé
- 🔔 Notification au coach

### À la modification (`booking.updated`)
- ✉️ Email de modification au client
- 📅 Événement Google Calendar mis à jour
- 🔔 Notification au coach

### À l'annulation (`booking.cancelled`)
- ✉️ Email d'annulation au client
- 📅 Événement Google Calendar supprimé
- 🔔 Notification au coach

## 🔧 Personnalisation

### Modifier l'email du coach

1. Ouvrir le workflow
2. Cliquer sur "Gmail - Notification Coach"
3. Modifier le champ "To" avec l'email du coach
4. Sauvegarder

### Modifier les templates d'email

1. Ouvrir le workflow
2. Cliquer sur le node Gmail correspondant
3. Modifier le champ "Email Body (HTML)"
4. Sauvegarder

### Modifier le calendrier

1. Ouvrir le workflow
2. Cliquer sur "Google Calendar - Create"
3. Modifier le champ "Calendar" (par défaut : "primary")
4. Sauvegarder

## 📖 Documentation complète

Pour plus de détails, voir le guide complet : `/docs/N8N_SETUP.md`

## 🆘 Support

Problèmes courants :
- **Webhook ne reçoit rien** : Vérifier que le workflow est ACTIF
- **Emails non envoyés** : Re-connecter les credentials Gmail
- **Calendar ne se met pas à jour** : Re-connecter les credentials Google Calendar

Pour plus d'aide : https://community.n8n.io

---

**Version** : 1.0.0
**Dernière mise à jour** : 15 novembre 2024
