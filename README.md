# Mawkzy Subathon Memory Book

Un site interactif permettant aux fans de Mawkzy de partager leurs souvenirs préférés du subathon, de consulter une galerie de moments mémorables, et d'explorer une timeline des événements marquants.

## Fonctionnalités

- **Soumission de souvenirs** : Les fans peuvent envoyer leurs messages et souvenirs du subathon
- **Galerie** : Collection de moments mémorables avec timestamps
- **Timeline interactive** : Chronologie des événements majeurs du subathon
- **Statistiques** : Informations détaillées sur le subathon (heures streamées, dons, etc.)
- **Design responsive** : Interface adaptée à tous les appareils

## Technologies utilisées

- React avec TypeScript
- SCSS pour le styling
- React Router pour la navigation
- Framer Motion pour les animations
- React Icons pour les icônes

## Installation

1. Cloner le dépôt
   ```bash
   git clone https://github.com/votre-username/mawkzy-subathon-memorybook.git
   cd mawkzy-subathon-memorybook
   ```

2. Installer les dépendances
   ```bash
   npm install
   ```

3. Lancer l'application en développement
   ```bash
   npm run dev
   ```

4. Construire pour la production
   ```bash
   npm run build
   ```

## Structure du projet

```
/src
  /components        # Composants réutilisables
    /layout          # Composants de structure (Header, Footer, etc.)
    /memories        # Composants liés aux souvenirs
    /gallery         # Composants de la galerie
    /timeline        # Composants de la timeline
    /stats           # Composants des statistiques
  /pages             # Pages principales de l'application
  /styles            # Fichiers SCSS globaux
  /types             # TypeScript interfaces et types
  /hooks             # Hooks personnalisés
  /services          # Services (API, auth, etc.)
  /utils             # Fonctions utilitaires et données mock
/public              # Ressources statiques
```

## Collaboration

Le projet est ouvert aux contributions de la communauté de Mawkzy. N'hésitez pas à soumettre des pull requests pour ajouter des fonctionnalités ou corriger des bugs.

## Licence

MIT
