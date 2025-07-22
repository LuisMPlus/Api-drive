import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear directorio de uploads si no existe
export const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuración de almacenamiento de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configuración de multer
export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB límite (aumentado para videos)
    fieldSize: 25 * 1024 * 1024, // 25MB para campos de formulario
  },
  fileFilter: (req, file, cb) => {
    // Obtener extensión del archivo
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    // Filtro opcional para tipos de archivo permitidos
    const allowedTypes = [
      // Imágenes
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/bmp',
      'image/tiff',
      'image/svg+xml',
      
      // Documentos
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      
      // Videos
      'video/mp4',
      'video/avi',
      'video/quicktime',
      'video/x-msvideo',
      'video/webm',
      'video/mkv',
      'video/x-matroska',
      'video/mov',
      'video/wmv',
      'video/flv',
      'video/3gpp',
      'video/x-ms-wmv',
      
      // Audio
      'audio/mpeg',
      'audio/wav',
      'audio/mp3',
      'audio/ogg',
      'audio/aac',
      'audio/m4a',
      
      // Texto
      'text/plain',
      'text/csv',
      'text/html',
      'text/xml',
      
      // Archivos comprimidos
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      'application/gzip'
    ];
    
    // Extensiones permitidas como fallback
    const allowedExtensions = [
      '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.svg',
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
      '.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.webm', '.3gp',
      '.mp3', '.wav', '.ogg', '.aac', '.m4a',
      '.txt', '.csv', '.html', '.xml',
      '.zip', '.rar', '.7z', '.gz'
    ];
    
    // Verificar tanto por tipo MIME como por extensión
    const isAllowedType = allowedTypes.includes(file.mimetype);
    const isAllowedExtension = allowedExtensions.includes(fileExtension);
    
    if (isAllowedType || isAllowedExtension) {
      console.log(`✅ Archivo permitido: ${file.originalname} (${file.mimetype})`);
      cb(null, true);
    } else {
      console.log(`❌ Archivo NO permitido: ${file.originalname} (${file.mimetype}) - Extensión: ${fileExtension}`);
      cb(new Error(`Tipo de archivo no permitido: ${file.mimetype} (${fileExtension})`));
    }
  }
});

// Middleware para campos específicos de archivos
export const uploadFields = upload.fields([
  { name: 'file1', maxCount: 1 },
  { name: 'file2', maxCount: 1 },
  { name: 'multipleFiles', maxCount: 10 }
]);
