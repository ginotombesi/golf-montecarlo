const express = require('express');
const { validationResult } = require('express-validator');
const { validateSimulationParams } = require('../validators/simulateValidator');

const router = express.Router();

router.post('/',
  validateSimulationParams,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { p1, p2, X, N, j, i, umbral, scoreOne = 50, scoreTwo = 25 } = req.body;
    let acum = 0;
    const stateRows = [];
    let lastRow = null;

    for (let k = 1; k <= N; k++) {
      let total = 0;
      const holes = [];  // Nuevo: registro por hoyo

      // Simulo X hoyos
      for (let h = 0; h < X; h++) {
        const r = Math.random();
        let cumul = 0, cat = 0;
        for (let idx = 0; idx < p1.length; idx++) {
          cumul += p1[idx];
          if (r < cumul) { cat = idx; break; }
        }

        let score = 0;
        if (cat === p1.length - 1) {
          score = scoreOne;
        } else if (Math.random() < p2[cat]) {
          score = scoreTwo;
        }
        total += score;
        holes.push(score);  // Almaceno puntaje del hoyo
      }

      const ex = total > umbral ? 1 : 0;
      acum += ex;
      const prob = acumulado => parseFloat((acumulado / k).toFixed(4));

      // Guardo filas j…j+i-1 y la última
      if ((k >= j && k <= j + i - 1) || k === N) {
        const row = { iteration: k, holes, total, ex, acum, prob: prob(acum) };
        if (k === N) lastRow = row;
        else stateRows.push(row);
      }
    }

    res.json({
      X,  // Nuevo: número de hoyos para el front-end
      probability: parseFloat((acum / N).toFixed(4)),
      totalSimulations: N,
      threshold: umbral,
      stateRows,
      lastRow
    });
  }
);

module.exports = router;