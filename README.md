# BBooker - Déploiement Docker

## Architecture

La stack complète BBooker comprend :
- **MongoDB 7** : Base de données (port 27017)
- **BBooker API** : Backend Elysia + Bun (port 3003)
- **BBooker Frontend** : React 19 + Rspack (port 3001)

## Démarrage rapide

### 1. Lancer l'API et MongoDB

```bash
cd bbooker
docker-compose -f docker-compose.dev.yml up -d mongodb bbooker-api
```

### 2. Vérifier que l'API fonctionne

```bash
curl http://localhost:3003/
```

### 3. Lancer le frontend (en développement)

```bash
PUBLIC_API_URL=http://localhost:3003 yarn dev
```

## Configuration

### Variables d'environnement importantes

**API Backend :**
- `DATABASE_URL` : Connexion MongoDB
- `JWT_SECRET` : Clé pour les tokens JWT
- `CORS_ORIGINS` : Origines autorisées (frontend)
- `FIREBASE_*` : Clés Firebase pour upload d'images

**Frontend :**
- `PUBLIC_API_URL` : URL de l'API backend

### Ports utilisés

- **3001** : Frontend React (développement)
- **3003** : API BBooker (Docker)
- **27017** : MongoDB (Docker)

## Commandes utiles

```bash
# Arrêter tous les services
docker-compose -f docker-compose.dev.yml down

# Voir les logs de l'API
docker-compose -f docker-compose.dev.yml logs bbooker-api

# Redémarrer l'API après changement config
docker-compose -f docker-compose.dev.yml restart bbooker-api

# Reconstruire l'image API après modifications
docker-compose -f docker-compose.dev.yml up -d --build bbooker-api
```

## Production

Pour la production, configurez :
1. Variables Firebase réelles dans `docker-compose.dev.yml`
2. JWT_SECRET sécurisé
3. Domaines de production dans CORS_ORIGINS
4. PUBLIC_API_URL vers votre domaine API

## Sécurité

✅ **Améliorations incluses :**
- Rate limiting (100 req/15min)
- Validation stricte des uploads
- Gestion d'erreurs centralisée
- Logs de sécurité
- Utilisateur MongoDB dédié