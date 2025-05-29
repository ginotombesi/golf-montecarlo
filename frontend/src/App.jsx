import React, { useState } from 'react';
import { Container, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import SimulationForm from './components/SimulationForm';
import ResultsTable from './components/ResultsTable';

export default function App() {
  const [result, setResult] = useState(null);

  return (
    <Container className="py-5">
      <motion.div
        as={Card}
        className="mx-auto shadow-sm"
        style={{ maxWidth: 800 }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card.Body>
          <Card.Title className="mb-4 text-primary">
            Golf Recreativo Simulator
          </Card.Title>
          <SimulationForm onResult={setResult} />
          {result && <ResultsTable data={result} />}
        </Card.Body>
      </motion.div>
    </Container>
  );
}
