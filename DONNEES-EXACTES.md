# Comment obtenir des données exactes pour FindMyCar

## État actuel du MVP

### ✅ Ce qui fonctionne
- **Décodage VIN** : NHTSA (US) + décodeur européen (40+ constructeurs)
- **Données techniques** : Marque, année modèle, motorisation (quand disponible)
- **Historique synthétique** : Kilométrage, dommages, propriété (pour démo)

### ❌ Limitations actuelles
1. **Modèle exact** : Le VIN ne code pas le modèle spécifique (DS4 vs C3)
2. **Plaque d'immatriculation** : Pas de conversion plaque → VIN
3. **Historique réel** : Données synthétiques (pas de vrais accidents/entretiens)
4. **Date d'immatriculation** : Calculée, pas extraite de registres officiels

---

## Solutions pour des données exactes

### 1️⃣ Recherche par plaque d'immatriculation (AB-123-CD)

**Problème** : Une plaque ne se convertit pas automatiquement en VIN.

**Solutions** :

#### Option A : API SIV (Système d'Immatriculation des Véhicules)
- **Fournisseur** : Ministère de l'Intérieur (via ANTS)
- **Accès** : Professionnels agréés uniquement
- **Conditions** :
  - Statut juridique de garage, concessionnaire, ou assureur
  - Convention avec l'ANTS
  - Respect RGPD
- **Données** : VIN, marque, modèle exact, date première immatriculation, puissance fiscale
- **Coût** : Variable selon contrat

#### Option B : API commerciales
| Service | Coût par requête | Données |
|---------|------------------|---------|
| **Identité Auto** | ~0.30€ | Plaque → VIN + historique carte grise |
| **SIVAuto API** | ~0.25€ | Conversion + caractéristiques techniques |
| **Cartegrise.com API** | ~0.40€ | Plaque → VIN + historique |
| **OVE (Observatoire du Véhicule)** | Sur devis | Données officielles certifiées |

**Implémentation** :
```typescript
// app/api/plate-to-vin/route.ts
export async function GET(request: NextRequest) {
  const plate = request.nextUrl.searchParams.get('plate');

  // Appel API SIVAuto (exemple)
  const response = await fetch(`https://api.sivauto.com/v1/lookup`, {
    headers: { 'Authorization': `Bearer ${process.env.SIVAUTO_API_KEY}` },
    body: JSON.stringify({ plate })
  });

  const data = await response.json();
  return NextResponse.json({ vin: data.vin, model: data.model });
}
```

---

### 2️⃣ Modèle exact du véhicule

**Problème actuel** : VIN ne code pas "DS4" vs "C3" pour Citroën.

**Solutions** :

#### Option A : Base de données constructeur
- **Fournisseur** : API constructeur (Citroën, Renault, etc.)
- **Exemple** : PSA DiagBox API, Renault DataConnect
- **Coût** : Accord commercial + frais par requête
- **Données** : Modèle exact, finition, équipements d'origine

#### Option B : Base de données VIN décodée
- **NHTSA** (gratuit) : US uniquement, incomplet pour Europe
- **Automotive API** (payant) : Base mondiale
  - Coût : ~0.05€/requête
  - Données : 17M+ véhicules, modèle exact, finitions

#### Option C : Base manuelle WMI étendue
Créer une base VIN → Modèle pour les cas courants :
```typescript
// VF7NX9HD8 = Citroën DS4
const VIN_TO_MODEL = {
  'VF7NX9HD': 'DS4',
  'VF7SA9H': 'C3',
  'VF7LA9H': 'C4 Cactus',
  // ...
};
```
**Limite** : Fastidieux, incomplet.

---

### 3️⃣ Historique réel des dommages

**Problème** : Données synthétiques actuellement.

**Solutions** :

#### Option A : Carfax Europe
- **Couverture** : 28 pays européens
- **Données** : Accidents déclarés, réparations, airbags déployés
- **Coût** : ~15€ par rapport (utilisateur final) ou 3-5€/requête (API B2B)
- **API** : https://www.carfax.eu/api

#### Option B : AutoCheck Europe
- **Couverture** : France, Allemagne, UK, Italie
- **Données** : Sinistres, vol, flood damage
- **Coût** : ~12€/rapport

#### Option C : Histovec (France uniquement)
- **Fournisseur** : Ministère de l'Intérieur
- **Accès** : Gratuit pour propriétaire actuel
- **Données** : Contrôles techniques, kilométrage officiel,gage
- **Limite** : Nécessite code fourni par le vendeur

**Implémentation** :
```typescript
// app/api/carfax/route.ts
export async function GET(request: NextRequest) {
  const vin = request.nextUrl.searchParams.get('vin');

  const response = await fetch(`https://api.carfax.eu/v1/reports/${vin}`, {
    headers: { 'X-API-Key': process.env.CARFAX_API_KEY }
  });

  const carfaxData = await response.json();
  return NextResponse.json(carfaxData);
}
```

---

### 4️⃣ Kilométrage et historique d'entretien

**Problème** : Généré synthétiquement.

**Solutions** :

#### Option A : Carfax/AutoCheck
- Inclut historique kilométrage des contrôles techniques et entretiens

#### Option B : Registres nationaux
- **France** : Histovec (via code vendeur)
- **Allemagne** : TÜV Reports
- **UK** : MOT History (gratuit) - https://www.gov.uk/check-mot-history

#### Option C : API carnet d'entretien constructeur
- **Exemple** : Renault My Renault API, PSA MyPeugeot
- **Accès** : Nécessite authentification propriétaire

---

### 5️⃣ Date d'immatriculation exacte

**Problème** : Calculée à partir de l'année modèle.

**Solutions** :

#### Option A : API SIV / Identité Auto
- Retourne date exacte de première immatriculation

#### Option B : Carte grise numérique
- Si utilisateur upload sa carte grise, extraire champ B (date 1ère immat.)
- OCR avec Google Vision API ou Tesseract

---

## Plan d'implémentation recommandé

### Phase 1 : MVP amélioré (gratuit/low-cost)
1. ✅ Décodage VIN amélioré (fait)
2. ✅ Validation plaque avec message explicite (fait)
3. 🔄 Intégration MOT History UK (gratuit pour tester l'historique réel)
4. 🔄 Base WMI étendue pour modèles courants français

### Phase 2 : Version payante (conversion requise)
1. API Identité Auto pour conversion plaque → VIN (0.30€/requête)
2. Carfax Europe pour historique réel (3-5€/requête)
3. Stocker résultats en cache pour réduire coûts

### Phase 3 : Version professionnelle
1. Accord SIV pour données officielles
2. API constructeurs pour données techniques exactes
3. Intégration Histovec

---

## Coûts estimés

### Par rapport généré (version payante)
- Conversion plaque → VIN : 0.30€
- Décodage VIN (NHTSA) : Gratuit
- Historique Carfax : 3.50€
- **Total** : ~3.80€ par rapport

### Modèle économique possible
- Rapport basique (VIN uniquement) : 4.99€
- Rapport complet (avec historique) : 19.99€
- Pack 5 rapports : 79.99€ (16€/rapport, marge 320%)

---

## Prochaines étapes immédiates

1. **Tester API gratuites** :
   - MOT History UK : https://documentation.history.mot.api.gov.uk/
   - NHTSA complaints : https://api.nhtsa.gov/complaints/

2. **Créer compte test** :
   - Carfax Developer : https://www.carfax.eu/contact
   - Identité Auto : https://identiteauto.com/api

3. **Implémenter cache** :
   - Ajouter TTL sur rapports (ex: 30 jours)
   - Éviter requêtes API répétées pour même VIN

4. **UI/UX** :
   - Badge "Données officielles" vs "Données synthétiques"
   - Expliquer clairement sources dans rapport
