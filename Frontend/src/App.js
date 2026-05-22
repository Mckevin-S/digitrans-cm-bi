import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

import {
  BarChart3,
  Users,
  ShieldCheck,
  DollarSign,
  MapPin,
  Layers,
  TrendingUp,
  Building2
} from 'lucide-react';

import KPICard from './components/KPICard';

import {
  fetchKPIResume,
  fetchCAParVille,
  fetchEvolution,
  fetchBudget,
  fetchEffectifs,
  fetchRestaurants
} from './services/api';

import './App.css';

const COULEURS_VILLES = [
  '#3B82F6',
  '#10B981',
  '#F97316',
  '#8B5CF6',
  '#0EA5E9'
];

function App() {

  // ===== NOUVEL AJOUT SANS IMPACT =====
  const APP_VERSION = '1.0.0';
  // ====================================

  const [resume, setResume] = useState(null);
  const [caVille, setCAVille] = useState([]);
  const [evolution, setEvo] = useState([]);
  const [budget, setBudget] = useState([]);
  const [effectifs, setEffectifs] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setOffline] = useState(!navigator.onLine);

  const latestMonth = effectifs.length
    ? effectifs[effectifs.length - 1].mois
    : null;

  const latestEffectifs = latestMonth
    ? effectifs.filter(item => item.mois === latestMonth)
    : [];

  const resumeData = resume ?? {
    ca_total_fcfa: 0,
    effectif_total: 0,
    taux_consommation_pct: 0,
    statut: 'SOUS_BUDGET',
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);

      const [r, c, e, b, ef, rest] = await Promise.all([
        fetchKPIResume(),
        fetchCAParVille(),
        fetchEvolution(),
        fetchBudget(),
        fetchEffectifs(),
        fetchRestaurants()
      ]);

      if (!isMounted) return;

      setResume(r);
      setCAVille(c);
      setEvo(e);
      setBudget(b);
      setEffectifs(ef);
      setRestaurants(rest);

      setLoading(false);
    };

    load();

    const handleOffline = () => setOffline(true);

    const handleOnline = () => {
      setOffline(false);
      load();
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      isMounted = false;

      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (loading)
    return (
      <div className="app-loader">
        <div className="loader-card">
          <div className="loader-icon">
            <BarChart3 size={42} />
          </div>

          <p>Chargement du dashboard DIGITRANS-CM...</p>

          {/* AJOUT SANS IMPACT */}
          <small>Version {APP_VERSION}</small>
        </div>
      </div>
    );

  return (
    <div className="app-shell">

      <header className="app-header">
        <div>
          <p className="app-eyebrow">
            DIGITRANS-CM • Tableau de bord BI
          </p>

          <h1>Analyse stratégique AGROCAM</h1>

          <p className="app-subtitle">
            Module BI — données opérationnelles et KPI consolidés
          </p>
        </div>

        <div className="app-status-group">

          <div className={`status-pill ${isOffline ? 'offline' : 'online'}`}>
            <span className="status-dot" />
            {isOffline ? 'Hors ligne' : 'Connecté'}
          </div>

          <div className="meta-card">
            <span>Dernière mise à jour</span>

            <strong>
              {new Date().toLocaleDateString('fr-FR')}
            </strong>
          </div>

        </div>
      </header>

      <main className="app-main">

        <section className="kpi-grid">

          <KPICard
            titre='CA total restaurants'
            valeur={`${(resumeData.ca_total_fcfa / 1000000).toFixed(1)} M FCFA`}
            couleur='#3B82F6'
            Icon={DollarSign}
          />

          <KPICard
            titre='Effectifs AGROCAM'
            valeur={`${resumeData.effectif_total} personnes`}
            couleur='#10B981'
            Icon={Users}
          />

          <KPICard
            titre='Consommation budget'
            valeur={`${resumeData.taux_consommation_pct} %`}
            couleur={
              resumeData.taux_consommation_pct > 100
                ? '#DC2626'
                : '#F97316'
            }
            Icon={ShieldCheck}
          />

          <KPICard
            titre='Statut projet'
            valeur={
              resumeData.statut === 'SOUS_BUDGET'
                ? 'Sous budget'
                : 'Dépassement'
            }
            couleur={
              resumeData.statut === 'SOUS_BUDGET'
                ? '#10B981'
                : '#DC2626'
            }
            Icon={TrendingUp}
          />

        </section>

        <section className="charts-grid">

          <article className="panel-card">

            <div className="panel-heading">
              <div>
                <p className="panel-title">CA par ville</p>

                <p className="panel-description">
                  Comparaison des chiffres d'affaires par implantation
                </p>
              </div>

              <MapPin size={20} />
            </div>

            <ResponsiveContainer width='100%' height={320}>

              <BarChart
                data={caVille}
                margin={{ left: 10, right: 10, top: 10, bottom: 0 }}
              >

                <CartesianGrid
                  strokeDasharray='4 4'
                  stroke='#E5E7EB'
                />

                <XAxis
                  dataKey='ville'
                  tick={{ fontSize: 12, fill: '#64748B' }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tickFormatter={v => `${(v / 1000000).toFixed(0)}M`}
                  tick={{ fontSize: 12, fill: '#64748B' }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  formatter={v => [
                    `${(v / 1000000).toFixed(2)} M FCFA`,
                    'CA'
                  ]}
                />

                <Bar dataKey='ca' radius={[8, 8, 0, 0]}>

                  {caVille.map((_, i) => (
                    <Cell
                      key={i}
                      fill={
                        COULEURS_VILLES[
                          i % COULEURS_VILLES.length
                        ]
                      }
                    />
                  ))}

                </Bar>

              </BarChart>

            </ResponsiveContainer>

          </article>

        </section>

      </main>

    </div>
  );
}

export default App;