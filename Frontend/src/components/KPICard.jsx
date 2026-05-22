export default function KPICard({ titre, valeur, couleur, icone, tendance }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      borderLeft: `4px solid ${couleur}`,
      transition: 'transform 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#94A3B8', textTransform: 'uppercase' }}>
            {titre}
          </p>
          <p style={{ margin: 0, fontSize: '26px', fontWeight: 'bold', color: '#1B2A4A' }}>
            {valeur ?? '—'}
          </p>
          {tendance && (
            <p style={{ margin: '6px 0 0', fontSize: '13px',
              color: tendance > 0 ? '#166534' : '#991B1B' }}>
              {tendance > 0 ? '▲' : '▼'} {Math.abs(tendance)}% vs mois précédent
            </p>
          )}
        </div>
        <span style={{ fontSize: '32px' }}>{icone}</span>
      </div>
    </div>
  );
}
