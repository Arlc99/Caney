require('dotenv').config(); // Añade esto al inicio
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Configuración CORS más segura
const allowedOrigins = [
  'https://tufrontend.netlify.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json()); // ¡IMPORTANTE! Para parsear JSON

// Conexión a MongoDB (usa variables de entorno)
const uri = process.env.MONGO_URI || " mongodb+srv://camilo313464:oDe5c403xO0ESwap@cluster0.gjecgds.mongodb.net/Caney?retryWrites=true&w=majoritymon";

mongoose.connect(uri)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => {
    console.error("❌ Error de conexión a MongoDB:", err);
    process.exit(1); // Sale si no puede conectar
  });

// Modelo de Reserva mejorado
const reservaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  celular: { type: String, required: true },
  fecha: { type: Date, required: true },
  motivo: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Reserva = mongoose.model('Reserva', reservaSchema);

// Ruta POST mejorada
app.post('/api/reservas', async (req, res) => {
  console.log('Body recibido:', req.body);
  
  try {
    const { nombre, celular, fecha, motivo } = req.body;

    // Validación mejorada
    if (!nombre || !celular || !fecha || !motivo) {
      return res.status(400).json({ 
        success: false,
        error: 'Todos los campos son requeridos' 
      });
    }

    // Manejo seguro de fechas
    const fechaReserva = new Date(fecha);
    if (isNaN(fechaReserva.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Formato de fecha inválido'
      });
    }

    const reserva = new Reserva({ 
      nombre, 
      celular, 
      fecha: fechaReserva, 
      motivo 
    });

    await reserva.save();
    
    res.status(201).json({
      success: true,
      data: reserva
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al procesar la reserva'
    });
  }
});

// Ruta GET con paginación
app.get('/api/reservas', async (req, res) => {
  try {
    const reservas = await Reserva.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: reservas.length,
      data: reservas
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Puerto configurable
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});