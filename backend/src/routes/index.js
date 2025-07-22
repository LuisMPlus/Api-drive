import express from 'express';
import formRoutes from './formRoutes.js';
import fileRoutes from './fileRoutes.js';

const router = express.Router();

// Ruta base para comprobar que la API funciona
router.get('/', (req, res) => {
  res.json({ 
    message: 'API de Formularios funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      forms: '/api/forms',
      download: '/api/download/:filename',
      fileInfo: '/api/file-info/:filename'
    }
  });
});

// Rutas de formularios
router.use('/forms', formRoutes);

// Rutas de archivos
router.use('/files', fileRoutes);

export default router;
