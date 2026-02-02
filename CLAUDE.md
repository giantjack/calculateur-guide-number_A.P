# Calculateur Nombre Guide Flash

## Description
Outil interactif pour calculer la distance maximale d'éclairage d'un flash en fonction de sa puissance (nombre guide), de la sensibilité ISO et de l'ouverture.

## Stack technique
- Vite + React + TypeScript
- Chakra UI pour les composants
- Déploiement GitHub Pages via GitHub Actions

## Formule utilisée
```
Distance max = NG × √(ISO ÷ 100) ÷ ouverture
```

Où :
- **NG** = Nombre Guide du flash (à ISO 100)
- **ISO** = Sensibilité sélectionnée
- **ouverture** = Valeur f/

## Structure
```
src/
  App.tsx      # Composant principal avec calculateur
  main.tsx     # Point d'entrée React
```

## Fonctionnalités
- Base de données de flashs courants (Canon, Nikon, Sony, Godox, Profoto)
- Entrée manuelle du nombre guide via slider
- Sélection ISO (100 à 6400)
- Sélection ouverture (f/1.4 à f/22)
- Visualisation graphique de la portée
- Tableau récapitulatif des distances par ouverture

## Commandes
```bash
npm install    # Installer les dépendances
npm run dev    # Serveur de développement
npm run build  # Build production
```

## Déploiement
Push sur `main` → GitHub Actions → GitHub Pages
URL: https://giantjack.github.io/calculateur-guide-number_A.P/
