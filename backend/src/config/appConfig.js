export const config = {
  // Puerto del servidor
  port: process.env.PORT || 3001,
  
  // Configuración de archivos
  files: {
    maxSize: 10 * 1024 * 1024, // 10MB
    maxMultipleFiles: 10,
    allowedExtensions: [
      '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', // Imágenes
      '.pdf', '.doc', '.docx', '.txt', '.rtf', // Documentos
      '.mp4', '.avi', '.mov', '.wmv', '.flv', // Videos
      '.mp3', '.wav', '.ogg', '.flac', // Audio
      '.zip', '.rar', '.7z', '.tar', '.gz' // Archivos comprimidos
    ]
  },
  
  // Configuración de CORS
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  },
  
  // Rutas
  paths: {
    uploads: './uploads',
    data: './data.json'
  }
};
