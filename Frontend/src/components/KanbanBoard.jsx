import React from 'react';

function KanbanBoard() {
  return (
    <section className="card kanban-board">
      <h2>Kanban Board</h2>
      <p>Suivi des tâches en cours, à venir et terminées.</p>
      <ul>
        <li>Prospection</li>
        <li>Qualification</li>
        <li>Clôture</li>
      </ul>
    </section>
  );
}

export default KanbanBoard;
