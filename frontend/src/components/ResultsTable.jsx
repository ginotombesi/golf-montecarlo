import React from 'react';

export default function ResultsTable({ data }) {
  // obtenemos toda la info que llego del backend
  const { X, probability, threshold, totalSimulations, stateRows, lastRow } = data;

  // Construyo encabezados: por cada hoyo, Puntos / 1er Tiro / 2do Tiro
  const holeHeaders = Array.from({ length: X }, (_, idx) => [
    `RND1 Hoyo ${idx + 1} 1er Tiro`,
    `Hoyo ${idx + 1} 1er Tiro`,
    `RND2 Hoyo ${idx + 1} 2do Tiro`,
    `Hoyo ${idx + 1} 2do Tiro`,
    `Hoyo ${idx + 1} Puntos`
  ]).flat();

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
            <th>Iter</th>
            {holeHeaders.map(h => (
              <th key={h}>{h}</th>
            ))}
            <th>Total</th>
            <th>Ex</th>
            <th>Acum</th>
            <th>Prob</th>
          </tr>
        </thead>
        <tbody>
          {/* Filas intermedias */}
          {stateRows.map(r => (
            <tr key={r.iteration}>
              <td>{r.iteration}</td>
              {r.holes.map((hole, i) => (
                <React.Fragment key={i}>
                  <td>{hole.rTrunc}</td>
                  <td>{hole.shot1}</td>
                  <td>{hole.r2Trunc}</td>
                  <td>{hole.shot2}</td>
                  <td>{hole.score}</td>
                </React.Fragment>
              ))}
              <td>{r.total}</td>
              <td>{r.ex}</td>
              <td>{r.acum}</td>
              <td>{r.prob}</td>
            </tr>
          ))}
          <tr className="table-primary">
            <td>{lastRow.iteration}</td>
            {lastRow.holes.map((hole, i) => (
              <React.Fragment key={i}>
                <td className="fw-semibold">{hole.rTrunc}</td>
                <td className="fw-semibold">{hole.shot1}</td>
                <td className="fw-semibold">{hole.r2Trunc}</td>
                <td className="fw-semibold">{hole.shot2}</td>
                <td className="fw-semibold">{hole.score}</td>
              </React.Fragment>
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
