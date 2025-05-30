const express = require('express');
const { validationResult } = require('express-validator');
const { validateSimulationParams } = require('../validators/simulateValidator');

const router = express.Router();

router.post('/',
  validateSimulationParams,
  (req, res) => {
    const { p1, p2, X, N, j, i, umbral, scoreOne, scoreTwo} = req.body;
    let acum = 0;
    const stateRows = [];
    let lastRow = null;

    // Etiquetas para los disparos
    const labels1 = ['>3m', '3-1m', '1-0m', 'emboca'];

    for (let k = 1; k <= N; k++) {
      let total = 0;
      const holes = [];

      for (let h = 0; h < X; h++) {
        // Primer disparo
        const r = Math.random();
        let cumul = 0, cat = 0;
        for (let idx = 0; idx < p1.length; idx++) {
          cumul += p1[idx];
          if (r < cumul) { cat = idx; break; }
        }
        const shot1 = labels1[cat];

        // Segundo disparo (solo si no embocó de una)
        let shot2;
        if (cat === p1.length - 1) {
          shot2 = '-';
        } else {
          shot2 = Math.random() < p2[cat] ? 'emboca' : 'falla';
        }

        // Cálculo de puntaje
        let score = 0;
        if (shot1 === 'emboca') {
          score = scoreOne;
        } else if (shot2 === 'emboca') {
          score = scoreTwo;
        }
        total += score;

        holes.push({ shot1, shot2, score });
      }

      const ex = total > umbral ? 1 : 0;
      acum += ex;
      const prob = acumulado => parseFloat((acumulado / k).toFixed(4));

      if ((k >= j && k <= j + i - 1) || k === N) {
        const row = { iteration: k, holes, total, ex, acum, prob: prob(acum) };
        if (k === N) lastRow = row;
        else stateRows.push(row);
      }
    }

    res.json({
      X,
      probability: parseFloat((acum / N).toFixed(4)),
      totalSimulations: N,
      threshold: umbral,
      stateRows,
      lastRow
    });
  }
);

module.exports = router;
