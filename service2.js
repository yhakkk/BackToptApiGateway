import express from 'express';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import qrcodeTerminal from 'qrcode-terminal';
import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import cors from 'cors'
import { verifyToken } from './auth.js';
const app = express();
app.use(express.json());
app.use(cors());
let secret;

mongoose.connect(
  process.env.BD_OTP, { useNewUrlParser: true, useUnifiedTopology: true }
);

app.get('/', async (req, res) => {
  return res.send("WORKING");
});

app.post('/generate-qr', verifyToken, async (req, res) => {
  const { email, empresa, password } = req.body;
  secret = speakeasy.generateSecret({ length: 20 });

  const otpauthUrl = speakeasy.otpauthURL({
    secret: secret.base32,
    label: `app:${email}`,
    issuer: `${empresa}`,
    encoding: 'base32'
  });

  try {
    const user = await User.findOne({ email });
    if (user) {
      user.secret = secret.base32;
      user.empresa = empresa;
      user.otpauthUrl = otpauthUrl;
      await user.save();

      const qrCode = await qrcode.toDataURL(otpauthUrl);
      res.send({ secret: secret.base32, qrcode: qrCode });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al generar el QR:', error);
    res.status(500).send('Error al guardar el secret');
  }
});




app.post('/verify-totp', async (req, res) => {
  const { token, email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.secret) {
      return res.status(400).send('Usuario no encontrado o secret no definido.');
    }

    const verified = speakeasy.totp.verify({
      secret: user.secret,
      encoding: 'base32',
      token: token
    });

    if (verified) {
      res.send('🤙🏼🤙🏼🤙🏼🤙🏼');
    } else {
      res.send('👎🏼👎🏼👎🏼👎🏼');
    }
  } catch (error) {
    console.error('Error verificando TOTP:', error);
    res.status(500).send('Error interno al verificar el TOTP');
  }
});

app.get('/generate-totp', (req, res) => {
  if (!secret) {
    return res.status(400).send('Secret no definido. Generar QR primero.');
  }
  const token = speakeasy.totp({ secret: secret.base32, encoding: 'base32' });
  res.json({ token });
});

app.listen(4002, () => console.log('Server en port 4002..'));
