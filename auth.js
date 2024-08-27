import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import axios from 'axios';


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }
  
    const token = authHeader.split(' ')[1];
  
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token inválido' });
      }
      req.user = decoded;
      next();
    });
  };


  // Middleware para verificar TOTP
export const verifyTOTP = async (req, res, next) => {
    const { token, email} = req.body; 
  
    try {
      const response = await axios.post('http://localhost:4002/verify-totp', {token, email});
  
      if (response.data.includes('🤙🏼')) {
        next();
      } else {
        res.status(401).send('TOTP Verification Failed');
      }
    } catch (error) {
      res.status(500).send('Error en la verificación de TOTP');
    }
  };
