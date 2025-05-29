import React from 'react';

export default function ResultsTable({ data }) {
  const { probability, threshold, totalSimulations, stateRows, lastRow } = data;

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
            {['Iter', 'Total', 'Ex', 'Acum', 'Prob'].map(h => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stateRows.map(r => (
            <tr key={r.iteration}>
              <td>{r.iteration}</td>
              <td>{r.total}</td>
              <td>{r.ex}</td>
              <td>{r.acum}</td>
              <td>{r.prob}</td>
            </tr>
          ))}
          <tr className="table-primary">
            {[lastRow.iteration, lastRow.total, lastRow.ex, lastRow.acum, lastRow.prob].map((v, i) => (
              <td key={i} className="fw-semibold">
                {v}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
