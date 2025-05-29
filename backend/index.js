const express = require('express');
const cors = require('cors');
const simulateRouter = require('./routes/simulate');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/simulate', simulateRouter);

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});