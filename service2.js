const express = require('express');
const app = express();
const port = 4002;

app.get('/', (req, res) => {
  res.send('Respuesta desde el Servicio 2 😏');
});

app.listen(port, () => {
  console.log(`Servicio 2 escuchando en http://localhost:${port}`);
});