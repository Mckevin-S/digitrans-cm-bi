import React from 'react';

function KpiCards() {
  return (
    <section className="kpi-cards">
      <div className="card">
        <h3>CA total</h3>
        <strong>€ 128,450</strong>
      </div>
      <div className="card">
        <h3>Commandes</h3>
        <strong>1,240</strong>
      </div>
      <div className="card">
        <h3>Conversion</h3>
        <strong>5.8%</strong>
      </div>
    </section>
  );
}

export default KpiCards;
