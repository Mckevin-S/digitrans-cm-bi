export default function KPICard({ titre, valeur, couleur, Icon }) {
  return (
    <article className="kpi-card" style={{ borderLeftColor: couleur }}>
      <div className="kpi-card-meta">
        <div>
          <p className="kpi-label">{titre}</p>
          <p className="kpi-value">{valeur ?? '—'}</p>
        </div>
        <div className="kpi-icon-wrapper">
          {Icon && <Icon size={24} />}
        </div>
      </div>
    </article>
  );
}
