const { body } = require('express-validator');

const validateSimulationParams = [
  body('p1').isArray({ min: 4, max: 4 }).withMessage('p1 debe ser un array de 4 probabilidades'),
  body('p1.*').isFloat({ min: 0, max: 1 }).withMessage('Valores de p1 entre 0 y 1'),
  body('p1').custom(arr => {
    const sum = arr.reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 1) > 1e-6) throw new Error('La suma de p1 debe ser 1');
    return true;
  }),
  body('p2').isArray({ min: 3, max: 3 }).withMessage('p2 debe ser un array de 3 probabilidades'),
  body('p2.*').isFloat({ min: 0, max: 1 }).withMessage('Valores de p2 entre 0 y 1'),
  body('X').isInt({ min: 1 }).withMessage('X debe ser entero positivo'),
  body('N').isInt({ min: 1 }).withMessage('N debe ser entero positivo'),
  body('j').isInt({ min: 1 }).withMessage('j debe ser entero positivo'),
  body('i').isInt({ min: 1 }).withMessage('i debe ser entero positivo'),
  body('umbral').isInt({ min: 0 }).withMessage('umbral debe ser entero ≥ 0'),
  body().custom(({ j, i, N }) => {
    if (j + i - 1 > N) throw new Error('j + i - 1 debe ser ≤ N');
    return true;
  })
];

module.exports = { validateSimulationParams };