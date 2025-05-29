import React, { useState } from 'react';
import { simulate } from '../api';

export default function SimulationForm({ onResult }) {
  const [p1, setP1] = useState([0.4, 0.25, 0.2, 0.15]);
  const [p2, setP2] = useState([0.1, 0.24, 0.43]);
  const [X, setX] = useState(10);
  const [N, setN] = useState(1000);
  const [j, setJ] = useState(1);
  const [i, setI] = useState(5);
  const [umbral, setUmbral] = useState(125);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const labels1 = ['>3m', '3-1m', '1-0m', 'emboca'];
  const labels2 = ['>3m', '3-1m', '1-0m'];

  const validate = () => {
    const errs = [];
    if (Math.abs(p1.reduce((a, b) => a + b, 0) - 1) > 1e-6)
      errs.push('La suma de p1 debe ser 1');
    if (j + i - 1 > N) errs.push('j + i - 1 debe ser ≤ N');
    [X, N, j, i, umbral].forEach(v => {
      if (!Number.isInteger(v) || v < 0)
        errs.push('Campos numéricos deben ser enteros ≥ 0');
    });
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (errs.length) {
      setErrors(errs);
      return;
    }
    setErrors([]);
    setLoading(true);
    try {
      const result = await simulate({ p1, p2, X, N, j, i, umbral });
      onResult(result);
    } catch (err) {
      setErrors(err.errors?.map(x => x.msg) || ['Error inesperado']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="row g-4">
      <fieldset className="col-md-6">
        <legend>Primer Golpe (p1)</legend>
        {p1.map((v, idx) => (
          <div key={idx} className="mb-2 input-group">
            <span className="input-group-text">{labels1[idx]}</span>
            <input
              type="number"
              step="0.01"
              value={v}
              className="form-control"
              onChange={e => {
                const a = [...p1];
                a[idx] = parseFloat(e.target.value);
                setP1(a);
              }}
            />
          </div>
        ))}
      </fieldset>

      <fieldset className="col-md-6">
        <legend>Segundo Golpe (p2)</legend>
        {p2.map((v, idx) => (
          <div key={idx} className="mb-2 input-group">
            <span className="input-group-text">{labels2[idx]}</span>
            <input
              type="number"
              step="0.01"
              value={v}
              className="form-control"
              onChange={e => {
                const a = [...p2];
                a[idx] = parseFloat(e.target.value);
                setP2(a);
              }}
            />
          </div>
        ))}
      </fieldset>

      {[
        ['Número de hoyos (X)', X, v => setX(+v)],
        ['Número de simulaciones (N)', N, v => setN(+v)],
        ['Desde iteración j', j, v => setJ(+v)],
        ['Cantidad (i)', i, v => setI(+v)],
        ['Umbral', umbral, v => setUmbral(+v)]
      ].map(([label, value, fn], idx) => (
        <div key={idx} className="col-md-4">
          <label className="form-label">{label}</label>
          <input
            type="number"
            value={value}
            className="form-control"
            onChange={e => fn(e.target.value)}
          />
        </div>
      ))}

      {errors.length > 0 && (
        <div className="col-12 alert alert-danger">
          <ul className="mb-0">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="col-12">
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? 'Simulando…' : 'Simular'}
        </button>
      </div>
    </form>
  );
}
