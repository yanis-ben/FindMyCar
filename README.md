# FindMyCar 🚗

Une application de vérification d'historique de véhicules. Achetez en toute confiance avec des rapports VIN détaillés.

![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.1-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Fonctionnalités principales

### 📋 Vérification d'historique de véhicule par VIN
- **Recherche rapide** : Par numéro VIN ou plaque d'immatriculation
- **Rapports complets et détaillés** incluant :
  - **Historique des dommages** : Accidents, réparations et dommages signalés avec photos
  - **Vérification du kilométrage** : Détection des manipulations du compteur kilométrique
  - **Historique de propriété** : Nombre de propriétaires précédents
  - **Vérification de vol** : Consultation des bases de données internationales de véhicules volés
- **Rapport instantané** : Généré en moins de 60 secondes
- **Export PDF inclus** : Téléchargez et partagez votre rapport
- **Plus de 900 sources de données** : Informations vérifiées et à jour

### 💎 Expérience utilisateur
- **Interface moderne** : Design responsive avec mode sombre
- **Architecture optimisée** : Next.js App Router avec composants réutilisables

## 🛠 Technologies utilisées

- **Framework** : [Next.js 16](https://nextjs.org/)
- **UI Library** : [React 19](https://react.dev/)
- **Styling** : [Tailwind CSS v4](https://tailwindcss.com/)
- **Language** : [TypeScript](https://www.typescriptlang.org/)
- **Linting** : ESLint avec configuration Next.js

## 🚀 Installation

\`\`\`bash
# Cloner le repository
git clone https://github.com/votre-username/findmycar.git

# Naviguer dans le dossier
cd findmycar

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
\`\`\`

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📜 Scripts disponibles

\`\`\`bash
npm run dev      # Démarre le serveur de développement
npm run build    # Crée une version de production
npm run start    # Démarre le serveur de production
npm run lint     # Lance ESLint
\`\`\`

## 📁 Structure du projet

\`\`\`
findmycar/
├── app/
│   ├── components/
│   │   ├── Header.tsx          # Navigation principale
│   │   ├── Footer.tsx          # Pied de page
│   │   └── VinSearchForm.tsx   # Formulaire de recherche
│   ├── report/
│   │   └── page.tsx            # Page de rapport détaillé
│   ├── page.tsx                # Page d'accueil
│   ├── layout.tsx              # Layout principal
│   └── globals.css             # Styles globaux
├── public/                     # Fichiers statiques
└── package.json
\`\`\`

## 🎨 Personnalisation

Le projet utilise une palette de couleurs teal/emerald qui peut être personnalisée dans les composants :

- Couleur principale : \`teal-600\`
- Couleur secondaire : \`emerald-600\`
- Dégradés : \`from-teal-500 to-emerald-600\`

## 🤝 Contribution

Les contributions sont les bienvenues! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (\`git checkout -b feature/AmazingFeature\`)
3. Commit vos changements (\`git commit -m 'Add some AmazingFeature'\`)
4. Push vers la branche (\`git push origin feature/AmazingFeature\`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier \`LICENSE\` pour plus de détails.

## 👨‍💻 Auteur

Développé avec ❤️ en utilisant Next.js et React.

## 💬 Support

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur GitHub.
