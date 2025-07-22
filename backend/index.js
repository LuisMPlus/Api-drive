import express from 'express';
import { setupMiddlewares, errorHandler } from './src/middlewares/appMiddlewares.js';
import apiRoutes from './src/routes/index.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configurar middlewares básicos
setupMiddlewares(app);

// Rutas de la API
app.use('/api', apiRoutes);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.json({ 
    message: 'Servidor de Formularios funcionando correctamente',
    version: '1.0.0',
    api: '/api'
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📱 API disponible en: http://localhost:${PORT}/api`);
  console.log(`📁 Uploads directory: ./uploads`);
});