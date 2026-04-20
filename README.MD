# Chalet du Tornet

Site officiel du **Chalet du Tornet** — restaurant, bar et terrasse au cœur du Domaine du Tornet, en bord du lac de La Balme-de-Sillingy (Haute-Savoie).

🌐 **Site en ligne :** https://chalet-du-tornet.netlify.app

---

## 📁 Contenu du dépôt

| Fichier | Rôle |
|---|---|
| `index.html` | Page principale du site (un seul fichier, HTML/CSS/JS embarqués) |
| `hero-terrasse.jpg` | Photo hero — terrasse face au lac |
| `logo.jpg` | Logo du Chalet (également utilisé comme favicon) |
| `robots.txt` | Directives pour les moteurs de recherche |
| `sitemap.xml` | Plan du site pour l'indexation |
| `netlify.toml` | Configuration Netlify (cache, headers) |

---

## 🚀 Publication

Le site est déployé automatiquement sur **Netlify** à chaque push sur la branche `main`.

Pour modifier une section : éditer `index.html`, commit, push. Netlify redéploie en ~30 secondes.

---

## 🖼️ Mettre à jour les photos

1. Remplacer `hero-terrasse.jpg` par la nouvelle photo hero (format paysage, min 1600px de large recommandé).
2. Pour la galerie : ouvrir `index.html`, chercher `<!-- GALLERY -->`, remplacer les URLs Unsplash par des chemins locaux type `photos/salle.jpg` (et ajouter les photos dans un dossier `photos/`).
3. Logo : remplacer `logo.jpg` (idéalement carré, min 512px).

---

## 📝 Mettre à jour le contenu

Tous les blocs de texte modifiables portent un attribut `data-cms="..."` dans le HTML. Structure CMS à venir (voir chez nous à la plage pour le modèle).

En attendant : éditer directement le HTML.

---

## 📞 Contact

- **Téléphone :** 04 38 80 22 51
- **Email :** chaletdutornet74@gmail.com
- **Adresse :** 161 Route de Paris, 74330 La Balme-de-Sillingy

---

© 2026 bleu-canard édition, Edmaster & Claudius, tout droit réservé.
