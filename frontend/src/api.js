export async function simulate(params) {
  const res = await fetch('http://localhost:4000/api/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw await res.json();
  return res.json();
}