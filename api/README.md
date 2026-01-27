# BBooker API

API REST pour l'application de réservation BeautyBooker, construite avec Elysia, Bun, Prisma et MongoDB.

## Stack technique

- **Runtime**: Bun
- **Framework**: Elysia 1.0.22
- **Base de données**: MongoDB via Prisma 5.22
- **Authentification**: JWT avec cookies httpOnly
- **Stockage**: Firebase Storage
- **IA**: Google Generative AI

## Développement

### Installation
```bash
bun install
```

### Configuration
Copier `.env.development` et configurer les variables :
```bash
cp .env.development .env
# Éditer .env avec vos vraies clés
```

### Démarrage
```bash
bun --env-file=.env.development run dev
```

L'API sera disponible sur http://localhost:3002

## Prisma

When creating new model or update a model, run:

```bash
rm -rf node_modules/
bun install
bunx prisma generate
bunx prisma migrate dev

# to create indexes (unique, primary key, etc...)
bunx prisma db push
```

## Améliorations récentes

### Sécurité
- Rate limiting (100 req/15min par IP)
- Validation stricte des uploads (2MB max, types autorisés)
- Gestion d'erreurs centralisée
- Logs d'erreurs horodatés

### Dépendances mises à jour
- Firebase SDK 12.8.0
- Google Generative AI 0.24.1
- Prisma 5.22.0 (compatible Prisma 7.x)
- dayjs 1.11.19
