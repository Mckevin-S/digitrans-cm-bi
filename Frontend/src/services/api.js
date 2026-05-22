import axios from 'axios';

// URL de l'API — change automatiquement selon l'environnement
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Instance axios configurée
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 secondes max (important pour latence camerounaise)
});

// ── Fonctions d'appel API ────────────────────────────────────

// Résumé KPI pour le dashboard principal
export const fetchKPIResume = async () => {
  try {
    const { data } = await api.get('/api/kpi/resume');
    localStorage.setItem('cache_resume', JSON.stringify(data));
    return data;
  } catch {
    const cached = localStorage.getItem('cache_resume');
    return cached ? JSON.parse(cached) : null;
  }
};

// CA par ville pour le Bar Chart
export const fetchCAParVille = async () => {
  try {
    const { data } = await api.get('/api/kpi/ca-par-ville');
    localStorage.setItem('cache_ca_ville', JSON.stringify(data));
    return data;
  } catch {
    const cached = localStorage.getItem('cache_ca_ville');
    return cached ? JSON.parse(cached) : [];
  }
};

// Évolution mensuelle pour le Line Chart
export const fetchEvolution = async () => {
  try {
    const { data } = await api.get('/api/kpi/evolution-mensuelle');
    localStorage.setItem('cache_evolution', JSON.stringify(data));
    return data;
  } catch {
    const cached = localStorage.getItem('cache_evolution');
    return cached ? JSON.parse(cached) : [];
  }
};

// Budget des modules pour le tableau comparatif
export const fetchBudget = async () => {
  try {
    const { data } = await api.get('/api/kpi/budget-modules');
    localStorage.setItem('cache_budget', JSON.stringify(data));
    return data;
  } catch {
    const cached = localStorage.getItem('cache_budget');
    return cached ? JSON.parse(cached) : [];
  }
};
