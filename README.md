# TP3 — API Produits

Auteur : Jean Marckenley Charles

API REST en TypeScript avec Express, PostgreSQL et Redis.

## Prérequis

- Node.js et npm
- Docker Desktop démarré

## Installation

Installer les dépendances :

```powershell
npm ci
```

Créer la configuration locale :

```powershell
Copy-Item .env.example .env
```

Dans `.env`, choisir un mot de passe et utiliser le même
dans POSTGRES_PASSWORD et DATABASE_URL.

Démarrer les services :

```powershell
docker compose up -d
docker compose ps
```

## Initialiser PostgreSQL

Ouvrir http://localhost:8081 dans le navigateur.

Connexion Adminer :
- Système : PostgreSQL
- Serveur : db
- Utilisateur : valeur de POSTGRES_USER
- Mot de passe : valeur de POSTGRES_PASSWORD
- Base de données : valeur de POSTGRES_DB

Dans « Import », sélectionner schema.sql et exécuter l’import.

## Lancer l’API

```powershell
npm run dev
```

L’API écoute par défaut sur http://localhost:3000.

## Routes

| Méthode | Adresse | Fonction |
|---|---|---|
| GET | /api/health | Vérifier PostgreSQL |
| GET | /api/produits | Lister les produits |
| GET | /api/produits/:id | Chercher un produit |
| POST | /api/produits | Créer un produit |
| PUT | /api/produits/:id | Modifier les quatre champs |
| DELETE | /api/produits/:id | Supprimer un produit |

## Cache Redis

La liste des produits est conservée pendant 60 secondes.

L’en-tête X-Cache indique :
- miss : données chargées depuis PostgreSQL et mises en cache.
- hit : données récupérées depuis Redis.
- bypass : Redis indisponible, utilisation de PostgreSQL.

Une création, modification ou suppression réussie invalide le cache.

## Vérification

```powershell
npx tsc --noEmit
```

Les requêtes de test se trouvent dans requetes.http.
Les captures se trouvent dans le dossier captures.

Pour les tests POST, PUT et DELETE, utiliser l’identifiant
réellement retourné lors de la création du produit.

## Arrêt

```powershell
docker compose down
```

Les données PostgreSQL restent dans le volume pgdata.
L’option -v supprime ce volume et ses données.

## Bonus E2 — Lancer toute l’application dans Docker

Le fichier Dockerbonus compile TypeScript et construit l’image de l’API.

Avant le lancement, créer un fichier .env à partir de .env.example et renseigner les valeurs.

Pour construire et démarrer les quatre services :

```bash
docker compose up -d --build
```

Pour vérifier leur état :

```bash
docker compose ps
```

Adresses :
- Produits : http://localhost:3000/api/produits
- Santé de l’API : http://localhost:3000/api/health
- Adminer : http://localhost:8081

Pour arrêter les services :

```bash
docker compose down
```

