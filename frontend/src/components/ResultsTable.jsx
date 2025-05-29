/* ResultsTable.jsx */
import React from 'react';

export default function ResultsTable({ data }) {
  const { X, probability, threshold, totalSimulations, stateRows, lastRow } = data;

  // Encabezados de hoyos dinámicos
  const holeHeaders = Array.from({ length: X }, (_, idx) => `Hoyo ${idx + 1}`);

  return (
    <div className="mt-4 table-responsive">
      <p className="mb-3">
        Probabilidad de superar <strong>{threshold}</strong> puntos en{' '}
        <strong>{totalSimulations}</strong> simulaciones:{' '}
        <span className="fw-bold text-primary">{probability}</span>
      </p>
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            {['Iter', ...holeHeaders, 'Total', 'Ex', 'Acum', 'Prob'].map(h => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stateRows.map(r => (
            <tr key={r.iteration}>
              <td>{r.iteration}</td>
              {r.holes.map((score, i) => (
                <td key={i}>{score}</td>
              ))}
              <td>{r.total}</td>
              <td>{r.ex}</td>
              <td>{r.acum}</td>
              <td>{r.prob}</td>
            </tr>
          ))}
          <tr className="table-primary">
            <td>{lastRow.iteration}</td>
            {lastRow.holes.map((score, i) => (
              <td key={i} className="fw-semibold">
                {score}
              </td>
            ))}
            <td className="fw-semibold">{lastRow.total}</td>
            <td className="fw-semibold">{lastRow.ex}</td>
            <td className="fw-semibold">{lastRow.acum}</td>
            <td className="fw-semibold">{lastRow.prob}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
