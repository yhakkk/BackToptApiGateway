import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import mongoose from 'mongoose';
// Configurar dotenv para cargar las variables de entorno
dotenv.config();

const app = express();
const PORT2 = process.env.PORT2 || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());


mongoose.connect(
  process.env.BD_OTP, { useNewUrlParser: true, useUnifiedTopology: true }
);

// Genera Token
const generateToken = (user) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
};

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'Usuario ya registrado' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = generateToken({ email: user.email });
    res.json({ token });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.listen(PORT2, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT2}`);
});
