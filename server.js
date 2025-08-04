const express = require('express');
const mongoose = require('mongoose');


const app = express();

// Middlewares esenciales (¡No olvides estos!)
// Configuración CORS más específica
// Ejemplo en Express (Node.js)
const cors = require("cors");
app.use(cors({
  origin: ["https://tufrontend-netlify.com", "http://localhost:3000"] // Permitir Netlify y localhost
})); // Para parsear JSON

// Conexión a MongoDB con manejo de errores mejorado
const uri = "mongodb+srv://camilo313464:oDe5c403xO0ESwap@cluster0.gjecgds.mongodb.net/Caney?retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch(err => console.error("❌ Error de conexión a MongoDB:", err));

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
  console.log("se ejecuto post");
  
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