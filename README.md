# 🚀 Anti-No-Show  : Généralités

Ce projet, développé par l'équipe Enetek, vise à réduire les **absences aux rendez-vous** grâce à des rappels proactifs, confirmations et reprogrammation autonome via SMS et messages vocaux.

## 📝 Rappel des objectifs
Pour plus de détails, voir [problematique.md](problematique.md).

L’objectif de ce projet est de proposer une solution **non pénalisante** sous forme de **rappels proactifs et engageants** pour les utilisateurs :  
- **Rappels personnalisés** avant le rendez-vous (D-3, D-1, H-3, H-1, H0, H+5)  
- **Confirmation ou reprogrammation en 1 clic**  
- **Tableau de bord KPI** pour suivre l’efficacité de la solution  

**KPI cibles :**
- Hausse du taux de présence de **+20 à +35 %**  
- Nombre de confirmations et reprogrammations  
- Suivi des no-shows et opt-outs

**Testez le projet en temps réel:** -> https://anti-no-show-enetek.vercel.app/

## 📦 Stack technique

- **Next.js 14** – Dashboard et pages utilisateurs  
- **Supabase (PostgreSQL)** – Gestion des rendez-vous et utilisateurs  
- **n8n** – Orchestration des rappels et envoi SMS/voix  
- **TopMessages** – Canal SMS et messages vocaux  
- **TailwindCSS / TypeScript / Day.js / React Hot Toast** – UI et expérience utilisateur  

## 🖥️ Workflow fonctionnel (macro)
Voici le diagramme fonctionnel du système :

![Alt text](./anti-no-show-final.png)

# 🚀 Configuration Dashboard 

Dashboard Next.js 14 pour la gestion des rendez-vous et la réduction des no-shows.

## 📦 Installation

```bash
# Cloner le projet
git clone <votre-repo>
cd anti-no-show-dashboard

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos credentials Supabase
```

## 🔐 Configuration Supabase 

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Créer la table `appointments` avec le schéma SQL fourni
3. Copier l'URL et la clé anonyme dans `.env.local`

### Schéma SQL

```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prenom VARCHAR(100) NOT NULL,
  objet VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  heure TIME NOT NULL,
  lieu_lien TEXT,
  status VARCHAR(20) DEFAULT 'PENDING',
  conseiller VARCHAR(100),
  telephone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_date ON appointments(date);
```


## 🔐 Configuration n8n
C'est l'orchestrateur principal du système de rappel Anti-No-Show. 

Pour la touche de boost d'engagement de l'utilisateur, nous avons intégrer des données sur la météo, et des messages personnalisés grâce à un système agent. 

A ne pas oublier qu'on vise une solution impactante, sous forme de **rappels proactifs et engageants** où il est crucial d'attirer efficacement l'attention de l'utilisateur. 

Vous aurez aux fichiers de config json n8n [ici](problematique.md)

## 🏃‍♂️ Lancement

```bash
# Développement
npm run dev

# Production
npm run build
npm start
```

## 📱 URLs du projet

- **Dashboard**: `http://localhost:3000`
- **Confirmation**: `http://localhost:3000/confirm/[id]`
- **Reprogrammation**: `http://localhost:3000/reschedule/[id]`
- **Désinscription**: `http://localhost:3000/optout/[id]`

## 🔗 Intégration SMS

Les liens à inclure dans vos SMS :
- Confirmation: `https://votredomaine.com/confirm/[ID_RDV]`
- Reprogrammation: `https://votredomaine.com/reschedule/[ID_RDV]`
- STOP: `https://votredomaine.com/optout/[ID_RDV]`

## 🌐 Déploiement

### Vercel (recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Configurer les variables d'environnement sur vercel.com
```

### Autres plateformes
- **Netlify**: Compatible avec Next.js
- **Railway**: Support natif de Next.js
- **VPS**: Utiliser PM2 pour la production

## 📊 Features

✅ Dashboard temps réel  
✅ Filtres avancés  
✅ Export CSV  
✅ Pages de confirmation/reprogrammation  
✅ Gestion des opt-outs  
✅ Responsive design  
✅ KPI en temps réel  

## 🔧 Technologies

- Next.js 14 (App Router)
- Supabase (PostgreSQL)
- TailwindCSS
- TypeScript
- Day.js
- React Hot Toast
- n8n

## 📝 License

MIT
