// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Configura CORS para Netlify
app.use(cors({
  origin: 'https://spontaneous-klepon-02dce0.netlify.app'
}));

app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Modelo de Reserva
const Reserva = mongoose.model('Reserva', {
  nombre: String,
  celular: String,
  fecha: Date,
  motivo: String
});

// Ruta para crear reservas
app.post('/api/reservas', async (req, res) => {
  try {
    const reserva = new Reserva(req.body);
    await reserva.save();
    res.status(201).json({ message: 'Reserva creada exitosamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));