require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Configuración CORS para producción
const allowedOrigins = [
  'https://spontaneous-klepon-02dce0.netlify.app/', // Reemplaza con tu URL real de Netlify
  'mongodb+srv://camilo313464:oDe5c403xO0ESwap@cluster0.gjecgds.mongodb.net/Caney?retryWrites=true&w=majority'           // Para desarrollo local
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como aplicaciones móviles o curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `Origen ${origin} no permitido por CORS`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Conexión segura a MongoDB
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("❌ ERROR: MONGO_URI no está definida en .env");
  process.exit(1);
}

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log("✅ Conectado a MongoDB Atlas"))
.catch(err => {
  console.error("❌ Error de conexión a MongoDB:", err.message);
  process.exit(1);
});

// Modelo y rutas (igual que en tu código original)
// ... [mantén tus modelos y rutas actuales]

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor listo en puerto ${PORT}`);
});