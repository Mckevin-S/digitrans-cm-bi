import pytest
from fastapi.testclient import TestClient
from app.main import app

# Client de test FastAPI (pas besoin d'un vrai serveur)
client = TestClient(app)

class TestHealthEndpoints:
    def test_root_returns_200(self):
        response = client.get('/')
        assert response.status_code == 200

    def test_health_check(self):
        response = client.get('/health')
        assert response.status_code == 200
        data = response.json()
        assert data['status'] == 'healthy'
        assert data['module'] == 'BI'

class TestKPIEndpoints:
    def test_resume_kpi_structure(self):
        response = client.get('/api/kpi/resume')
        assert response.status_code == 200
        data = response.json()
        # Vérifier que toutes les clés attendues sont présentes
        assert 'ca_total_fcfa' in data
        assert 'effectif_total' in data
        assert 'taux_consommation_pct' in data

    def test_ca_par_ville_not_empty(self):
        response = client.get('/api/kpi/ca-par-ville')
        assert response.status_code == 200
        data = response.json()
        assert len(data) > 0  # Doit retourner au moins une ville
        assert 'ville' in data[0]
        assert 'ca' in data[0]

    def test_evolution_mensuelle_5_mois(self):
        response = client.get('/api/kpi/evolution-mensuelle')
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 5  # Janvier à Mai 2026

    def test_budget_modules_4_modules(self):
        response = client.get('/api/kpi/budget-modules')
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 4  # ERP, CRM, Supply Chain, BI

    def test_erp_effectifs_endpoint(self):
        response = client.get('/api/erp/effectifs')
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        assert 'mois' in data[0]
        assert 'departement' in data[0]

    def test_crm_restaurants_endpoint(self):
        response = client.get('/api/crm/restaurants')
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        assert 'ville' in data[0]
        assert 'restaurant' in data[0]

# Lancer les tests : pytest tests/ -v
# Résultat attendu : 8 tests passed
