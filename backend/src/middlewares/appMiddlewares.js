import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configuración de middlewares básicos
 * @param {Express} app - Instancia de Express
 */
export const setupMiddlewares = (app) => {
  // CORS
  app.use(cors());
  
  // Parser de JSON con límite aumentado
  app.use(express.json({ limit: '100mb' }));
  
  // Parser de URL encoded con límite aumentado
  app.use(express.urlencoded({ limit: '100mb', extended: true }));
  
  // Servir archivos estáticos (uploads)
  app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
};

/**
 * Middleware para validar campos requeridos en formularios
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const validateRequiredFields = (req, res, next) => {
  const { textInput1, textInput2 } = req.body;
  
  if (!textInput1 || !textInput2) {
    return res.status(400).json({ 
      error: 'Los campos de texto son requeridos',
      details: {
        textInput1: !textInput1 ? 'Campo requerido' : null,
        textInput2: !textInput2 ? 'Campo requerido' : null
      }
    });
  }
  
  next();
};

/**
 * Middleware para manejo de errores
 * @param {Error} err - Error object
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Errores de Multer
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      error: 'El archivo es demasiado grande. Máximo 100MB por archivo.',
      details: 'Reduce el tamaño del archivo o usa un formato más comprimido.'
    });
  }
  
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ 
      error: 'Demasiados archivos. Máximo 10 archivos múltiples.' 
    });
  }
  
  if (err.code === 'LIMIT_FIELD_VALUE') {
    return res.status(400).json({ 
      error: 'Valor del campo demasiado grande. Máximo 25MB por campo.' 
    });
  }
  
  // Errores de tipo de archivo
  if (err.message && err.message.includes('Tipo de archivo no permitido')) {
    return res.status(400).json({ 
      error: err.message,
      details: 'Tipos permitidos: imágenes, PDF, documentos de Office, videos (MP4, AVI, MKV, MOV, WMV, etc.), audio, texto, archivos comprimidos'
    });
  }
  
  // Errores de Google Drive
  if (err.message && err.message.includes('timeout')) {
    return res.status(408).json({ 
      error: 'Timeout: El archivo es demasiado grande o la conexión es lenta',
      details: 'Intenta con un archivo más pequeño o verifica tu conexión a internet.'
    });
  }
  
  if (err.message && err.message.includes('demasiado grande')) {
    return res.status(413).json({ 
      error: err.message,
      details: 'Google Drive tiene límites de tamaño para archivos.'
    });
  }
  
  // Error genérico
  res.status(500).json({ 
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : 'Contacta al administrador'
  });
};
