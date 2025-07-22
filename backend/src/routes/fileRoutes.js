import express from 'express';
import { downloadFile, getFileInfo, downloadFromDrive, getDriveFileUrl, getDriveFileInfo, getDriveFilePreview } from '../controllers/fileController.js';

const router = express.Router();

// Rutas específicas de Google Drive (deben ir ANTES de las rutas generales)
// GET /api/files/drive-preview/:fileId - Obtener URLs de preview de archivo en Drive
router.get('/drive-preview/:fileId', getDriveFilePreview);

// GET /api/files/drive-url/:fileId - Obtener URL pública de archivo en Drive
router.get('/drive-url/:fileId', getDriveFileUrl);

// GET /api/files/drive-info/:fileId - Obtener información de archivo en Drive
router.get('/drive-info/:fileId', getDriveFileInfo);

// GET /api/files/drive/:fileId - Descargar archivo desde Google Drive
router.get('/drive/:fileId', downloadFromDrive);

// GET /api/files/info/:filename - Obtener información del archivo local
router.get('/info/:filename', getFileInfo);

// GET /api/files/:filename - Descargar archivo local (debe ir AL FINAL)
router.get('/:filename', downloadFile);

export default router;
