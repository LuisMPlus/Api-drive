import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Cargar variables de entorno primero
dotenv.config();

export const folderId = process.env.DRIVE_FOLDER_ID;

const __dirname = fileURLToPath (import.meta.url);
const __filename = path.dirname(__dirname);

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

export const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
});

/**
 * Subir archivo a Google Drive
 * @param {string} filePath - Ruta del archivo local
 * @param {string} fileName - Nombre del archivo en Drive
 * @param {string} mimeType - Tipo MIME del archivo
 * @returns {Promise<Object>} - Respuesta de Google Drive con el ID del archivo
 */
export async function uploadToDrive(filePath, fileName, mimeType) {
    try {
        console.log(`📤 Iniciando subida a Drive: ${fileName} (${mimeType})`);
        
        // Verificar que el archivo existe
        if (!fs.existsSync(filePath)) {
            throw new Error(`Archivo no encontrado: ${filePath}`);
        }
        
        // Obtener información del archivo
        const stats = fs.statSync(filePath);
        console.log(`📊 Tamaño del archivo: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
        
        // Configurar opciones de subida con timeout aumentado
        const requestOptions = {
            timeout: 300000, // 5 minutos timeout
        };
        
        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                parents: [folderId],
            },
            media: {
                mimeType: mimeType,
                body: fs.createReadStream(filePath)
            },
            fields: 'id, name, size, mimeType, createdTime'
        }, requestOptions);
        
        console.log(`✅ Archivo subido exitosamente a Drive: ${response.data.id}`);
        
        // Hacer el archivo público
        await drive.permissions.create({
            fileId: response.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });
        
        console.log(`🌐 Archivo configurado como público: ${response.data.id}`);
        
        return response.data;
    } catch (error) {
        console.error('❌ Error uploading to Drive:', error);
        
        // Proporcionar mensajes de error más específicos
        if (error.code === 'ENOTFOUND') {
            throw new Error('Error de conexión: No se pudo conectar con Google Drive');
        } else if (error.code === 'ECONNRESET') {
            throw new Error('Conexión perdida durante la subida. Intenta con un archivo más pequeño');
        } else if (error.code === 403) {
            throw new Error('Permisos insuficientes para subir a Google Drive');
        } else if (error.code === 413) {
            throw new Error('El archivo es demasiado grande para Google Drive');
        } else if (error.message && error.message.includes('timeout')) {
            throw new Error('Timeout: El archivo es demasiado grande o la conexión es lenta');
        }
        
        throw error;
    }
}

/**
 * Obtener enlace público de un archivo en Drive
 * @param {string} fileId - ID del archivo en Drive
 * @returns {Promise<Object>} - Enlaces del archivo
 */
export async function getPublicUrl(fileId) {
    try {
        const result = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink'
        });
        return result.data;
    } catch (error) {
        console.error('Error getting public URL:', error);
        throw error;
    }
}

/**
 * Obtener URLs de preview para un archivo de Drive
 * @param {string} fileId - ID del archivo en Drive
 * @returns {Promise<Object>} - URLs de preview
 */
export async function getPreviewUrls(fileId) {
    try {
        const response = await drive.files.get({
            fileId: fileId,
            fields: 'id, name, mimeType, webViewLink, webContentLink, thumbnailLink'
        });

        const file = response.data;
        
        return {
            fileId: fileId,
            name: file.name,
            mimeType: file.mimeType,
            webViewLink: file.webViewLink,
            webContentLink: file.webContentLink,
            thumbnailLink: file.thumbnailLink,
            // URLs específicas para preview
            previewUrl: `https://drive.google.com/file/d/${fileId}/preview`,
            embedUrl: `https://drive.google.com/file/d/${fileId}/view?usp=sharing`,
            // Para PDFs
            pdfEmbedUrl: `https://drive.google.com/file/d/${fileId}/preview?usp=sharing`,
            // Para imágenes
            imageDirectUrl: `https://drive.google.com/uc?id=${fileId}`,
            // Para documentos de Office
            officePreviewUrl: `https://docs.google.com/viewer?url=https://drive.google.com/uc?id=${fileId}&embedded=true`
        };
    } catch (error) {
        console.error('Error getting preview URLs:', error);
        throw error;
    }
}

