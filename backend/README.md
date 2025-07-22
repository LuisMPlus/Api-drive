# Backend - Gestor de Formularios

## Estructura del Proyecto

```
backend/
├── index.js                 # Punto de entrada principal
├── package.json            # Dependencias y scripts
├── data.json               # Base de datos JSON (se crea automáticamente)
├── uploads/                # Carpeta de archivos subidos (se crea automáticamente)
└── src/
    ├── config/
    │   ├── appConfig.js     # Configuración general de la aplicación
    │   └── multerConfig.js  # Configuración de Multer para archivos
    ├── controllers/
    │   ├── formController.js # Controladores para operaciones CRUD de formularios
    │   └── fileController.js # Controladores para manejo de archivos
    ├── middlewares/
    │   └── appMiddlewares.js # Middlewares personalizados
    ├── routes/
    │   ├── index.js         # Enrutador principal
    │   ├── formRoutes.js    # Rutas de formularios
    │   └── fileRoutes.js    # Rutas de archivos
    └── utils/
        └── fileUtils.js     # Utilidades para manejo de archivos
```

## Características

### Controladores

#### FormController
- `getAllForms()` - Obtiene todos los formularios
- `getFormById(id)` - Obtiene un formulario por ID
- `createForm()` - Crea un nuevo formulario
- `updateForm(id)` - Actualiza un formulario existente
- `deleteForm(id)` - Elimina un formulario

#### FileController
- `downloadFile(filename)` - Descarga un archivo
- `getFileInfo(filename)` - Obtiene información de un archivo

### Middlewares

- **setupMiddlewares()** - Configura CORS, JSON parser y archivos estáticos
- **validateRequiredFields()** - Valida campos requeridos en formularios
- **errorHandler()** - Manejo centralizado de errores

### Utilidades

- **readData()** - Lee datos del archivo JSON
- **writeData()** - Escribe datos al archivo JSON
- **deleteFiles()** - Elimina archivos del sistema de archivos

## API Endpoints

### Formularios
- `GET /api/forms` - Obtener todos los formularios
- `GET /api/forms/:id` - Obtener un formulario por ID
- `POST /api/forms` - Crear nuevo formulario
- `PUT /api/forms/:id` - Actualizar formulario
- `DELETE /api/forms/:id` - Eliminar formulario

### Archivos
- `GET /api/download/:filename` - Descargar archivo
- `GET /api/file-info/:filename` - Obtener información del archivo

## Configuración

### Variables de Entorno
- `PORT` - Puerto del servidor (default: 3001)
- `FRONTEND_URL` - URL del frontend para CORS (default: http://localhost:5173)

### Límites de Archivos
- Tamaño máximo por archivo: 10MB
- Máximo de archivos múltiples: 10
- Extensiones permitidas: imágenes, documentos, videos, audio, archivos comprimidos

## Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar en modo producción
npm start
```

## Tecnologías Utilizadas

- **Express.js** - Framework web
- **Multer** - Manejo de archivos multipart/form-data
- **UUID** - Generación de IDs únicos
- **CORS** - Configuración de CORS
- **Node.js** - Runtime de JavaScript
