import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis,
         CartesianGrid, Tooltip, Legend, ResponsiveContainer,
         Cell } from 'recharts';
import KPICard from './components/KPICard';
import { fetchKPIResume, fetchCAParVille, fetchEvolution, fetchBudget } from './services/api';

const COULEURS_VILLES = ['#2563EB', '#166534', '#EA580C', '#6D28D9', '#0F766E'];

function App() {
  const [resume, setResume] = useState(null);
  const [caVille, setCAVille] = useState([]);
  const [evolution, setEvo] = useState([]);
  const [budget, setBudget] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      const [r, c, e, b] = await Promise.all([
        fetchKPIResume(), fetchCAParVille(), fetchEvolution(), fetchBudget()
      ]);

      if (!isMounted) return;
      setResume(r);
      setCAVille(c);
      setEvo(e);
      setBudget(b);
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

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center',
      height:'100vh', background:'#F1F5F9' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:'48px', marginBottom:'16px' }}>📊</div>
        <p style={{ color:'#475569', fontSize:'18px' }}>Chargement DIGITRANS-CM...</p>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily:'Segoe UI,system-ui,sans-serif',
                  background:'#F1F5F9', minHeight:'100vh', padding:'0' }}>

      <div style={{ background:'#1B2A4A', color:'white', padding:'16px 32px',
                    display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <h1 style={{ margin:0, fontSize:'20px', fontWeight:'bold' }}>
            📊 DIGITRANS-CM — Tableaux de bord AGROCAM S.A.
          </h1>
          <p style={{ margin:'4px 0 0', fontSize:'13px', color:'#93C5FD' }}>
            Module BI • Mise à jour : {new Date().toLocaleDateString('fr-CM')}
          </p>
        </div>
        {isOffline && (
          <div style={{ background:'#FEF08A', color:'#713F12',
                        padding:'8px 16px', borderRadius:'8px', fontSize:'14px' }}>
            ⚡ Mode hors ligne — Données en cache local
          </div>
        )}
      </div>

      <div style={{ padding:'24px 32px' }}>
        {resume && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)',
                        gap:'20px', marginBottom:'28px' }}>
            <KPICard titre='CA Total Restaurants'
              valeur={`${(resume.ca_total_fcfa / 1000000).toFixed(1)} M FCFA`}
              couleur='#2563EB' icone='💰' />
            <KPICard titre='Effectifs AGROCAM'
              valeur={`${resume.effectif_total} personnes`}
              couleur='#166534' icone='👥' />
            <KPICard titre='Budget Consommé'
              valeur={`${resume.taux_consommation_pct} %`}
              couleur={resume.taux_consommation_pct > 100 ? '#991B1B' : '#EA580C'}
              icone='📈' />
            <KPICard titre='Statut Projet'
              valeur={resume.statut === 'SOUS_BUDGET' ? '✅ Sous budget' : '⚠️ Dépassement'}
              couleur={resume.statut === 'SOUS_BUDGET' ? '#166534' : '#991B1B'}
              icone='🎯' />
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px' }}>
          <div style={{ background:'white', borderRadius:'12px', padding:'24px',
                        boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin:'0 0 20px', color:'#1B2A4A', fontSize:'16px' }}>
              CA SavoirManger par Ville (FCFA)
            </h3>
            <ResponsiveContainer width='100%' height={260}>
              <BarChart data={caVille} margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray='3 3' stroke='#F1F5F9' />
                <XAxis dataKey='ville' tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={v => [`${(v / 1000000).toFixed(2)} M FCFA`, 'CA']} />
                <Bar dataKey='ca' name='CA mensuel' radius={[6,6,0,0]}>
                  {caVille.map((_, i) => (
                    <Cell key={i} fill={COULEURS_VILLES[i % COULEURS_VILLES.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background:'white', borderRadius:'12px', padding:'24px',
                        boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin:'0 0 20px', color:'#1B2A4A', fontSize:'16px' }}>
              Évolution CA — Janvier à Mai 2026
            </h3>
            <ResponsiveContainer width='100%' height={260}>
              <LineChart data={evolution}>
                <CartesianGrid strokeDasharray='3 3' stroke='#F1F5F9' />
                <XAxis dataKey='mois' tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={v => [`${(v / 1000000).toFixed(2)} M FCFA`, 'CA']} />
                <Line type='monotone' dataKey='ca' stroke='#2563EB'
                  strokeWidth={3} dot={{ r: 6, fill: '#2563EB' }}
                  activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background:'white', borderRadius:'12px', padding:'24px',
                        boxShadow:'0 2px 8px rgba(0,0,0,0.06)', gridColumn:'span 2' }}>
            <h3 style={{ margin:'0 0 20px', color:'#1B2A4A', fontSize:'16px' }}>
              Suivi Budgétaire DIGITRANS-CM — Budget Prévu vs Réel (FCFA)
            </h3>
            <ResponsiveContainer width='100%' height={220}>
              <BarChart data={budget} layout='vertical' margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray='3 3' stroke='#F1F5F9' />
                <XAxis type='number' tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} />
                <YAxis type='category' dataKey='module' tick={{ fontSize: 13 }} />
                <Tooltip formatter={v => [`${(v / 1000000).toFixed(1)} M FCFA`]} />
                <Legend />
                <Bar dataKey='prevu' name='Budget prévu' fill='#DBEAFE' radius={[0,4,4,0]} />
                <Bar dataKey='reel'  name='Dépenses réelles'
                  radius={[0,4,4,0]}
                  fill='#2563EB' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
