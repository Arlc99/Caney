const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares esenciales (¡No olvides estos!)
app.use(cors()); // Habilita CORS
app.use(express.json()); // Para parsear JSON

// Conexión a MongoDB con manejo de errores mejorado
mongoose.connect('mongodb://localhost:27017/caney', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => {
  console.error('❌ Error de conexión a MongoDB:', err);
  process.exit(1); // Sale si no puede conectar
});

// Modelo de Reserva
const Reserva = mongoose.model('Reserva', {
  nombre: String,
  celular: String,
  fecha: Date,
  motivo: String
});

// ¡RUTA CORREGIDA! - Asegúrate que coincida exactamente con el frontend
app.post('/api/reservas', async (req, res) => {
  console.log('Recibida petición POST a /api/reservas'); // Log para depuración
  
  try {
    const { nombre, celular, fecha, motivo } = req.body;
    
    // Validación básica
    if (!nombre || !celular || !fecha || !motivo) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const reserva = new Reserva({ nombre, celular, fecha: new Date(fecha), motivo });
    await reserva.save();
    
    res.status(201).json({
      success: true,
      message: 'Reserva creada exitosamente',
      data: reserva
    });
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Ruta GET para probar
app.get('/api/reservas', async (req, res) => {
  try {
    const reservas = await Reserva.find();
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta de prueba básica
app.get('/', (req, res) => {
  res.send('Servidor de reservas funcionando');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});