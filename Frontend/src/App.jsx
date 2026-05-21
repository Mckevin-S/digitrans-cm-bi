import React from 'react';
import './App.css';
import KpiCards from './components/KpiCards';
import VentesChart from './components/VentesChart';
import KanbanBoard from './components/KanbanBoard';
import TopProduits from './components/TopProduits';

function App() {
  return (
    <div className="App">
      <main className="App-main">
        <KpiCards />
        <VentesChart />
        <div className="App-grid">
          <KanbanBoard />
          <TopProduits />
        </div>
      </main>
    </div>
  );
}

export default App;
