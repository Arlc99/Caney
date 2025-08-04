require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Configura CORS solo para tu frontend de Netlify
app.use(cors({
  origin: 'https://spontaneous-klepon-02dce0.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());

// Conexión a MongoDB Atlas (usa variables de entorno)
const uri = process.env.MONGO_URI;
mongoose.connect(uri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

// Ruta de ejemplo para crear datos
app.post('/api/posts', async (req, res) => {
  try {
    const newPost = await Post.create(req.body); // Asumiendo que tienes un modelo Post
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));