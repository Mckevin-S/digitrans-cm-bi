# DIGITRANS-CM — Module BI

Tableau de bord BI pour AGROCAM S.A. avec une API FastAPI backend et une application React frontend.

## Architecture

- `Backend/` : API FastAPI, modèles SQLAlchemy, seed de données simulées, tests Pytest.
- `frontend/` : application React basée sur `react-scripts`, affichage de KPI, graphiques `recharts` et composants professionnels.
- `docker-compose.yml` : orchestration Docker pour PostgreSQL, Redis, backend et frontend.

## Fonctionnalités

- Dashboard BI centralisé avec KPI financiers et effectifs
- Graphiques CA par ville et évolution mensuelle
- Tableaux de budget par module
- Modules ERP / CRM exposés via endpoints dédiés
- Caching local offline-first dans le frontend
- Données simulées injectées au démarrage

## Services exposés

### Backend API

- `GET /` : point de santé et info de l’API
- `GET /health` : vérification de l’état du service

### KPI

- `GET /api/kpi/resume` : résumé KPI global
- `GET /api/kpi/ca-par-ville` : CA mensuel par ville
- `GET /api/kpi/evolution-mensuelle` : évolution du CA mois par mois
- `GET /api/kpi/budget-modules` : budget prévu vs réel par module

### ERP

- `GET /api/erp/effectifs` : effectifs par département et mois

### CRM

- `GET /api/crm/restaurants` : liste des restaurants SavoirManger par ville

## Installation locale

### Backend

1. Aller dans le dossier backend :
   ```powershell
   cd Backend
   ```
2. Installer les dépendances Python :
   ```powershell
   python -m pip install -r requirements.txt
   ```
3. Lancer le serveur FastAPI :
   ```powershell
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
4. Ouvrir la doc interactive :
   - `http://localhost:8000/docs`

### Frontend

1. Aller dans le dossier frontend :
   ```powershell
   cd frontend
   ```
2. Installer les dépendances npm :
   ```powershell
   npm install
   ```
3. Lancer l’application React :
   ```powershell
   npm start
   ```
4. Ouvrir l’application :
   - `http://localhost:3000`

## Exécution avec Docker

1. Depuis la racine du projet :
   ```powershell
   docker compose up --build
   ```
2. Services disponibles :
   - Backend FastAPI : `http://localhost:8000`
   - Frontend React : `http://localhost:3000`

## Configuration

- `docker-compose.yml` utilise PostgreSQL et Redis pour l’infrastructure complète.
- Si `DATABASE_URL` n’est pas défini, le backend bascule automatiquement sur `sqlite:///./digitrans_bi.db`.
- Le frontend peut pointer vers une API personnalisée avec `REACT_APP_API_URL`.

## Tests

### Backend

1. Depuis `Backend/` :
   ```powershell
   python -m pytest tests/test_kpi.py -q
   ```
2. Tests couverts : santé de l’API, résumé KPI, CA par ville, évolution mensuelle, budget modules, endpoints ERP/CRM.

## Points techniques importants

- Les modèles SQLAlchemy sont définis dans `Backend/app/models.py`.
- Les données simulées sont créées dans `Backend/app/etl/seed.py`.
- La base de données est accessible via `Backend/app/database.py`.
- Le frontend utilise `frontend/src/services/api.js` pour centraliser les appels API et le cache local.
- `frontend/src/App.js` orchestre le dashboard et gère l’état de connexion hors-ligne.

## Notes

- Le projet est conçu pour un contexte pédagogique et pour illustrer un module BI connecté.
- La doc OpenAPI est disponible automatiquement avec FastAPI.
- En production, il est recommandé de restreindre les origines CORS et d’utiliser un vrai stockage Redis si nécessaire.

---

`DIGITRANS-CM` — Version 1.0.0
