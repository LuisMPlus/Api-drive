import { fileTypeFromFile } from 'file-type';
import mime from 'mime-types';

// Función para obtener tipo MIME de un archivo
function getMimeType(filename) {
  // Primero intentar con mime-types
  const mimeType = mime.lookup(filename);
  if (mimeType) {
    return mimeType;
  }
  
  // Si no funciona, intentar con la extensión
  const extension = filename.split('.').pop().toLowerCase();
  const mimeMap = {
    'mkv': 'video/x-matroska',
    'mp4': 'video/mp4',
    'avi': 'video/x-msvideo',
    'mov': 'video/quicktime',
    'wmv': 'video/x-ms-wmv',
    'flv': 'video/x-flv',
    '3gp': 'video/3gpp'
  };
  
  return mimeMap[extension] || 'application/octet-stream';
}

// Probar diferentes tipos de archivo
const testFiles = [
  'video.mkv',
  'video.mp4',
  'video.avi',
  'video.mov',
  'video.wmv',
  'document.pdf',
  'image.jpg',
  'audio.mp3'
];

console.log('🧪 Probando tipos MIME:');
testFiles.forEach(file => {
  const mimeType = getMimeType(file);
  console.log(`${file} -> ${mimeType}`);
});
