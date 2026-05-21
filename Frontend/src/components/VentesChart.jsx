import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const data = [
  { month: 'Jan', ventes: 4200 },
  { month: 'Fév', ventes: 5300 },
  { month: 'Mar', ventes: 6100 },
  { month: 'Avr', ventes: 7400 },
  { month: 'Mai', ventes: 8200 },
  { month: 'Juin', ventes: 9100 },
];

function VentesChart() {
  return (
    <section className="card ventes-chart">
      <h2>Ventes</h2>
      <ResponsiveContainer width="100%" height={270}>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="ventes" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </section>
  );
}

export default VentesChart;
