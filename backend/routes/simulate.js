const express = require('express');
const { validationResult } = require('express-validator');
const { validateSimulationParams } = require('../validators/simulateValidator');

const router = express.Router();

router.post('/',
  validateSimulationParams,
  (req, res) => {
    const { p1, p2, X, N, j, i, umbral, scoreOne, scoreTwo } = req.body;
    let acum = 0;
    const stateRows = [];
    let lastRow = null;

    // Etiquetas para los disparos
    const labels1 = ['>3m', '3-1m', '1-0m', 'emboca'];
    
    // For para las rondas 
    for (let k = 1; k <= N; k++) {
      let total = 0;
      const holes = [];
      // For para los hoyos
      for (let h = 0; h < X; h++) {
        // Primer disparo
        const r = Math.random();
        let cumul = 0, cat = 0;
        // Recorremos las probabilidades cargadas, las acumulamos y determinamos a qué categoría pertenece el golpe
        for (let idx = 0; idx < p1.length; idx++) {
          cumul += p1[idx];
          if (r < cumul) { cat = idx; break; }
        }
        // Asignamos el resultado del primer disparo
        const shot1 = labels1[cat];

        // Segundo disparo (solo si no embocó de una)
        let shot2;
        // si la categoría del primer golpe es 'emboca' (cat===3), no hay segundo golpe
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
        // Guardamos el hoyo con sus disparos y puntaje
        holes.push({ shot1, shot2, score });
      }
      // Cálculo del éxito (Si el total de puntaje es mayor al umbral, se considera un éxito)
      const ex = total > umbral ? 1 : 0;
      acum += ex;
      // Cálculo de la probabilidad de la ronda
      const prob = acumulado => parseFloat((acumulado / k).toFixed(4));

      // Mostrar el vector estado si corresponde si el número de ronda es >= j y < j + i o si es la última ronda (N)
      if ((k >= j && k <= j + i - 1) || k === N) {
        // armamos el vector estado
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
