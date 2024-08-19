import express from 'express';
const app = express();
const port = 4001;

app.get('/', (req, res) => {
  res.send('Respuesta desde el Servicio 1 🤨');
});

app.listen(port, () => {
  console.log(`Servicio 1 escuchando en http://localhost:${port}`);
});