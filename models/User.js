import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true // Agregué esto para evitar duplicados de email
    },
    password: {
        type: String,
        required: true
    },
    empresa: {
        type: String, // No es requerido ahora
    },
    secret: {
        type: String, // No es requerido ahora
    },
    otpauthUrl: {
        type: String, // No es requerido ahora
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;
