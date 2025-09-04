#!/bin/bash
# Script pour connecter le projet local au repo GitHub
# À exécuter une fois le repo GitHub créé

echo "🔗 Connexion au repository GitHub..."

# Ajouter le remote origin (REMPLACEZ L'URL par votre repo)
git remote add origin https://github.com/VOTRE-USERNAME/eternelportrait-backend.git

# Vérifier la branche
git branch -M main

# Pousser le code
git push -u origin main

echo "✅ Code envoyé sur GitHub !"
echo "🚀 Maintenant, déployez sur Vercel via GitHub."