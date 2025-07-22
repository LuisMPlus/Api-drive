import fs from 'fs';
import path from 'path';
import { uploadsDir } from '../config/multerConfig.js';
import { drive, getPublicUrl, getPreviewUrls } from '../config/driveConfig.js';

/**
 * Descargar un archivo por nombre
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const downloadFile = (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);
    
    // Verificar que el archivo existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    // Enviar el archivo para descarga
    res.download(filePath, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ error: 'Error al descargar el archivo' });
      }
    });
  } catch (error) {
    console.error('Error in download file controller:', error);
    res.status(500).json({ error: 'Error al descargar el archivo' });
  }
};

/**
 * Obtener información de un archivo
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getFileInfo = (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    const stats = fs.statSync(filePath);
    
    res.json({
      filename: filename,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      extension: path.extname(filename)
    });
  } catch (error) {
    console.error('Error getting file info:', error);
    res.status(500).json({ error: 'Error al obtener información del archivo' });
  }
};

/**
 * Descargar un archivo desde Google Drive
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const downloadFromDrive = async (req, res) => {
  try {
    const { fileId } = req.params;
    
    // Obtener información del archivo
    const fileInfo = await drive.files.get({
      fileId: fileId,
      fields: 'name, size, mimeType'
    });

    // Obtener el contenido del archivo
    const fileStream = await drive.files.get({
      fileId: fileId,
      alt: 'media'
    }, { responseType: 'stream' });

    // Configurar headers para la descarga
    res.setHeader('Content-Disposition', `attachment; filename="${fileInfo.data.name}"`);
    res.setHeader('Content-Type', fileInfo.data.mimeType);
    res.setHeader('Content-Length', fileInfo.data.size);

    // Pipe el stream del archivo al response
    fileStream.data.pipe(res);
  } catch (error) {
    console.error('Error downloading from Drive:', error);
    res.status(500).json({ error: 'Error al descargar el archivo desde Drive' });
  }
};

/**
 * Obtener URL pública de un archivo en Google Drive
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getDriveFileUrl = async (req, res) => {
  try {
    const { fileId } = req.params;
    
    const urls = await getPublicUrl(fileId);
    
    res.json({
      fileId: fileId,
      webViewLink: urls.webViewLink,
      webContentLink: urls.webContentLink
    });
  } catch (error) {
    console.error('Error getting Drive file URL:', error);
    res.status(500).json({ error: 'Error al obtener la URL del archivo' });
  }
};

/**
 * Obtener información de un archivo en Google Drive
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getDriveFileInfo = async (req, res) => {
  try {
    const { fileId } = req.params;
    
    const fileInfo = await drive.files.get({
      fileId: fileId,
      fields: 'id, name, size, mimeType, createdTime, modifiedTime, parents'
    });
    
    res.json(fileInfo.data);
  } catch (error) {
    console.error('Error getting Drive file info:', error);
    res.status(500).json({ error: 'Error al obtener información del archivo de Drive' });
  }
};

/**
 * Obtener URLs de preview para un archivo en Google Drive
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getDriveFilePreview = async (req, res) => {
  try {
    const { fileId } = req.params;
    
    const previewData = await getPreviewUrls(fileId);
    
    res.json(previewData);
  } catch (error) {
    console.error('Error getting Drive file preview:', error);
    res.status(500).json({ error: 'Error al obtener el preview del archivo' });
  }
};
