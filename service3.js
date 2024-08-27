import express from 'express';
import dotenv from 'dotenv';
import { verifyTOTP, verifyToken } from './auth.js';
import axios from 'axios';
dotenv.config();

const app = express();
const PORT3 = process.env.PORT3 || 3000;

app.use(express.json());


app.get('/test', verifyToken, verifyTOTP, async (req, res) => {
    try {
      const response = await axios.get("https://rickandmortyapi.com/api/character");
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los datos de Rick and Morty API", error: error.message });
    }
  });
  

app.listen(PORT3, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT3}`);
});
