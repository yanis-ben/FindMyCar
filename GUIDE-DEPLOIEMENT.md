# 🚀 Guide Complet de Déploiement - FindMyCar

Date: 2026-01-05

---

## 📋 TABLE DES MATIÈRES

1. [Préparation Locale](#préparation-locale)
2. [Choix de la Plateforme](#choix-de-la-plateforme)
3. [Déploiement sur Vercel (Recommandé)](#déploiement-sur-vercel)
4. [Configuration Base de Données Production](#configuration-base-de-données)
5. [Variables d'Environnement Production](#variables-denvironnement)
6. [Tests Post-Déploiement](#tests-post-déploiement)
7. [Nom de Domaine Custom](#nom-de-domaine-custom)

---

## 1️⃣ PRÉPARATION LOCALE

### Étape 1.1 : Générer Prisma Client

**Dans votre terminal** (arrêtez d'abord le serveur avec Ctrl+C) :

```bash
# 1. Générer le client Prisma avec les modèles User
npx prisma generate

# 2. Pusher le schema vers la base de données locale
npx prisma db push

# 3. Vérifier que tout compile
npm run build
```

Si `npm run build` réussit, vous êtes prêt ! ✅

---

### Étape 1.2 : Tester Localement l'Authentification

Avant de déployer, testez que tout fonctionne :

```bash
# Démarrer le serveur
npm run dev
```

1. Allez sur http://localhost:3000
2. Cliquez "Connexion" → "S'inscrire"
3. Créez un compte de test
4. Connectez-vous
5. Vérifiez que votre nom apparaît dans le header
6. Testez un rapport VIN
7. Déconnectez-vous

**Tout fonctionne ?** Passez à l'étape suivante ✅

---

### Étape 1.3 : Initialiser Git (si pas fait)

```bash
# Vérifier le statut git
git status

# Si pas encore de commit, initialiser
git init
git add .
git commit -m "🎉 Initial commit - FindMyCar with NextAuth"

# Créer un repo sur GitHub
# Puis lier le repo
git remote add origin https://github.com/VOTRE-USERNAME/findmycar.git
git branch -M main
git push -u origin main
```

---

## 2️⃣ CHOIX DE LA PLATEFORME

### Option A : Vercel (⭐ RECOMMANDÉ)

**Avantages** :
- ✅ Parfait pour Next.js (créé par Vercel)
- ✅ Déploiement en 3 clics
- ✅ HTTPS automatique
- ✅ Preview deployments
- ✅ Free tier généreux
- ✅ Postgres gratuit (Vercel Postgres)

**Inconvénients** :
- ❌ SQLite ne fonctionne pas (fichiers éphémères)

**Coût** : Gratuit jusqu'à 100GB bandwidth

---

### Option B : Netlify

**Avantages** :
- ✅ Facile à utiliser
- ✅ Free tier

**Inconvénients** :
- ❌ Pas optimisé pour Next.js
- ❌ Nécessite configuration supplémentaire

---

### Option C : Railway / Render

**Avantages** :
- ✅ Supporte serveurs Node.js
- ✅ Base de données PostgreSQL incluse

**Inconvénients** :
- ❌ Plus cher que Vercel
- ❌ Configuration manuelle

---

## 3️⃣ DÉPLOIEMENT SUR VERCEL (Recommandé)

### Étape 3.1 : Créer un Compte Vercel

1. Allez sur https://vercel.com/signup
2. Connectez-vous avec votre compte GitHub
3. Autorisez Vercel à accéder à vos repos

---

### Étape 3.2 : Importer le Projet

1. Cliquez "Add New..." → "Project"
2. Sélectionnez votre repo `findmycar`
3. Cliquez "Import"

**Configuration détectée automatiquement** :
- Framework: Next.js ✅
- Build Command: `npm run build` ✅
- Output Directory: `.next` ✅

---

### Étape 3.3 : Configurer les Variables d'Environnement

**AVANT de déployer**, ajoutez les variables d'environnement :

#### Variables Requises :

```env
# Base de données (temporaire - on changera après)
DATABASE_URL=file:./dev.db

# NextAuth
NEXTAUTH_URL=https://VOTRE-APP.vercel.app
NEXTAUTH_SECRET=<GÉNÉRER-UN-NOUVEAU-SECRET>

# Base URL
NEXT_PUBLIC_BASE_URL=https://VOTRE-APP.vercel.app

# Node Env
NODE_ENV=production
```

#### Générer un NEXTAUTH_SECRET sécurisé :

Dans votre terminal local :
```bash
openssl rand -base64 32
```

Copiez le résultat et utilisez-le comme `NEXTAUTH_SECRET`.

---

### Étape 3.4 : Déployer

1. Cliquez "Deploy"
2. Attendez 2-3 minutes
3. Votre site est en ligne ! 🎉

**URL temporaire** : https://findmycar-xxx.vercel.app

---

## 4️⃣ CONFIGURATION BASE DE DONNÉES PRODUCTION

**⚠️ IMPORTANT** : SQLite ne fonctionne PAS sur Vercel (fichiers éphémères).

### Option A : Vercel Postgres (Gratuit)

#### 1. Créer une base Postgres sur Vercel

Dans votre projet Vercel :
1. Allez dans l'onglet "Storage"
2. Cliquez "Create Database"
3. Sélectionnez "Postgres"
4. Choisissez la région (Europe West recommended)
5. Cliquez "Create"

#### 2. Lier la Base au Projet

1. Sélectionnez votre projet `findmycar`
2. Cliquez "Connect"
3. Vercel ajoute automatiquement `DATABASE_URL` aux variables d'environnement

#### 3. Mettre à Jour Prisma Schema

Dans votre code local, modifiez `prisma/schema.prisma` :

```prisma
datasource db {
  provider = "postgresql"  // Changé de "sqlite" à "postgresql"
  url      = env("DATABASE_URL")
}
```

#### 4. Pusher les Changements

```bash
# Commit les changements
git add prisma/schema.prisma
git commit -m "chore: migrate to PostgreSQL for production"
git push origin main
```

Vercel redéploie automatiquement ! ✅

#### 5. Migrer la Base de Données

Dans le terminal Vercel (ou localement avec `DATABASE_URL` de production) :

```bash
npx prisma db push
```

---

### Option B : Supabase (Gratuit + Généreux)

#### 1. Créer un Compte Supabase

1. Allez sur https://supabase.com
2. Créez un compte
3. Créez un nouveau projet
4. Choisissez une région proche de vous
5. Notez le mot de passe de la base de données

#### 2. Récupérer la Connection String

1. Dans Supabase, allez dans "Project Settings" → "Database"
2. Copiez la "Connection String" (mode: Transaction)
3. Remplacez `[YOUR-PASSWORD]` par votre mot de passe

Format :
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
```

#### 3. Ajouter à Vercel

Dans Vercel :
1. Settings → Environment Variables
2. Modifier `DATABASE_URL`
3. Coller la connection string Supabase
4. Sauvegarder

#### 4. Redéployer

1. Deployments → Latest → "Redeploy"
2. Attendre le déploiement

---

### Option C : Neon (PostgreSQL Serverless)

Similaire à Supabase :
1. https://neon.tech
2. Créer un projet
3. Copier la connection string
4. Ajouter à Vercel

---

## 5️⃣ VARIABLES D'ENVIRONNEMENT PRODUCTION

### Variables Complètes pour Production

Dans Vercel → Settings → Environment Variables :

```env
# Base de Données (Vercel Postgres ou Supabase)
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_URL=https://findmycar.vercel.app  # Votre URL Vercel
NEXTAUTH_SECRET=<SECRET-SECURISE-32-CHARS>

# Base URL
NEXT_PUBLIC_BASE_URL=https://findmycar.vercel.app

# Node Environment
NODE_ENV=production
```

### ⚠️ SÉCURITÉ

**NE JAMAIS** :
- Commit `.env` dans Git
- Partager `NEXTAUTH_SECRET`
- Utiliser le même secret en dev et prod

**TOUJOURS** :
- Générer un nouveau secret pour production
- Utiliser HTTPS en production
- Vérifier `.gitignore` contient `.env`

---

## 6️⃣ TESTS POST-DÉPLOIEMENT

### Checklist Après Déploiement

Sur votre URL de production (https://VOTRE-APP.vercel.app) :

- [ ] Page d'accueil charge correctement
- [ ] Recherche VIN fonctionne (testez avec `VF7NX9HD8DY598843`)
- [ ] Rapport s'affiche avec données
- [ ] Bouton "Connexion" fonctionne
- [ ] Inscription crée un compte
- [ ] Connexion fonctionne
- [ ] Nom utilisateur apparaît dans header
- [ ] Déconnexion fonctionne
- [ ] Dark mode fonctionne
- [ ] Mobile responsive (testez sur téléphone)

### Tester avec DevTools

1. Ouvrir DevTools (F12)
2. Onglet Console : aucune erreur rouge
3. Onglet Network : toutes les requêtes 200 OK
4. Onglet Application → Storage : voir les cookies NextAuth

---

## 7️⃣ NOM DE DOMAINE CUSTOM

### Option 1 : Acheter un Domaine

**Où acheter** :
- Namecheap (~$10/an)
- Google Domains (~$12/an)
- OVH (~8€/an)
- Gandi (~15€/an)

**Suggestions de noms** :
- findmycar.fr
- monhistovehicule.fr
- vin-checker.fr

---

### Option 2 : Configurer sur Vercel

#### 1. Ajouter le Domaine

Dans Vercel :
1. Allez dans Settings → Domains
2. Ajoutez votre domaine : `findmycar.fr`
3. Vercel vous donne les DNS records

#### 2. Configurer DNS

Chez votre registrar (Namecheap, etc.) :

**Type A Record** :
```
Type: A
Name: @
Value: 76.76.21.21
```

**Type CNAME Record (pour www)** :
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### 3. Attendre Propagation DNS

- Temps : 5 minutes à 48 heures
- Moyenne : 1-2 heures

#### 4. Vérifier

```bash
# Dans le terminal
nslookup findmycar.fr
```

Si vous voyez `76.76.21.21`, c'est bon ! ✅

#### 5. Mettre à Jour les Variables d'Environnement

Dans Vercel :
```env
NEXTAUTH_URL=https://findmycar.fr
NEXT_PUBLIC_BASE_URL=https://findmycar.fr
```

Redéployez !

---

## 8️⃣ OPTIMISATIONS POST-DÉPLOIEMENT

### SEO

Ajoutez à `app/layout.tsx` :

```typescript
export const metadata: Metadata = {
  title: "FindMyCar - Vérification d'historique de véhicule",
  description: "Vérifiez l'historique complet d'un véhicule avec FindMyCar...",
  openGraph: {
    title: "FindMyCar - Vérification VIN",
    description: "Service de vérification d'historique véhicule",
    url: "https://findmycar.fr",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "FindMyCar",
    description: "Vérification historique véhicule",
  },
};
```

---

### Analytics

**Google Analytics** :
1. Créez une propriété GA4
2. Copiez l'ID (G-XXXXXXXXXX)
3. Ajoutez dans `app/layout.tsx` :

```typescript
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
  strategy="afterInteractive"
/>
```

---

### Performance

Vercel optimise automatiquement :
- ✅ Image optimization
- ✅ Code splitting
- ✅ CDN global
- ✅ Edge functions

**Vérifier les performances** :
- https://pagespeed.web.dev/
- https://gtmetrix.com/

---

## 9️⃣ MONITORING & LOGS

### Vercel Logs

1. Allez dans Deployments → Latest
2. Cliquez "View Function Logs"
3. Voir les erreurs en temps réel

### Sentry (Erreurs)

Pour tracker les erreurs :
1. https://sentry.io (gratuit)
2. Créez un projet Next.js
3. Suivez les instructions d'installation

---

## 🔟 MISES À JOUR FUTURES

### Workflow de Déploiement

```bash
# 1. Développer en local
git checkout -b feature/nouvelle-fonctionnalite

# 2. Commit
git add .
git commit -m "feat: ajouter nouvelle fonctionnalité"

# 3. Push
git push origin feature/nouvelle-fonctionnalite

# 4. Pull Request sur GitHub
# Vercel crée automatiquement une Preview Deployment

# 5. Tester la preview
# URL: https://findmycar-git-feature-xxx.vercel.app

# 6. Merge dans main
# Vercel déploie automatiquement en production
```

---

## ⚠️ PROBLÈMES COURANTS

### 1. Erreur "Module not found"
**Solution** :
```bash
npm install
git add package-lock.json
git push
```

### 2. Base de données vide après déploiement
**Solution** :
```bash
# Avec DATABASE_URL de production
npx prisma db push
```

### 3. NextAuth erreur "NEXTAUTH_SECRET missing"
**Solution** : Vérifier variables d'environnement dans Vercel

### 4. 500 Error sur production
**Solution** :
1. Vérifier les logs Vercel
2. Tester `npm run build` localement
3. Vérifier DATABASE_URL est correct

---

## 📊 CHECKLIST FINALE AVANT PRODUCTION

- [ ] `npm run build` réussit localement
- [ ] Tests authentification fonctionnent
- [ ] Variables d'environnement configurées sur Vercel
- [ ] Base de données PostgreSQL configurée
- [ ] `npx prisma db push` exécuté en production
- [ ] NEXTAUTH_SECRET généré et unique
- [ ] Site accessible sur URL Vercel
- [ ] Toutes les fonctionnalités testées
- [ ] Aucune erreur dans console browser
- [ ] Responsive testé sur mobile
- [ ] SSL/HTTPS actif (automatique avec Vercel)

---

## 🎉 FÉLICITATIONS !

Votre application FindMyCar est maintenant **EN LIGNE** !

**URL** : https://VOTRE-APP.vercel.app

**Prochaines étapes** :
1. Partager avec des amis pour tester
2. Ajouter Google Analytics
3. Améliorer SEO
4. Ajouter plus de fonctionnalités

---

## 📞 SUPPORT

**Problème de déploiement ?**
- Vercel Docs : https://vercel.com/docs
- NextAuth Docs : https://next-auth.js.org/deployment
- Prisma Docs : https://www.prisma.io/docs/guides/deployment

**Besoin d'aide ?**
- GitHub Issues du projet
- Stack Overflow
- Vercel Discord

---

Temps estimé de déploiement : **30-60 minutes**
Coût : **GRATUIT** (free tiers Vercel + Vercel Postgres)
