import { v4 as uuidv4 } from 'uuid';
import { readData, writeData, deleteFiles } from '../utils/fileUtils.js';
import { uploadToDrive } from '../config/driveConfig.js';
import fs from 'fs';

/**
 * Subir archivo a Google Drive y retornar información del archivo
 * @param {Object} file - Archivo de multer
 * @returns {Promise<Object>} - Información del archivo subido a Drive
 */
async function uploadFileToDrive(file) {
  try {
    console.log(`📤 Procesando archivo: ${file.originalname} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
    
    const driveResponse = await uploadToDrive(file.path, file.originalname, file.mimetype);
    
    // Eliminar archivo local después de subirlo a Drive
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
      console.log(`🗑️ Archivo local eliminado: ${file.path}`);
    }
    
    return {
      driveId: driveResponse.id,
      filename: driveResponse.name,
      originalname: file.originalname,
      size: driveResponse.size,
      mimetype: file.mimetype,
      createdTime: driveResponse.createdTime
    };
  } catch (error) {
    console.error(`❌ Error procesando archivo ${file.originalname}:`, error.message);
    
    // Si falla la subida a Drive, eliminar archivo local
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
      console.log(`🗑️ Archivo local eliminado después de error: ${file.path}`);
    }
    
    // Proporcionar mensaje de error más específico
    if (error.message.includes('timeout') || error.message.includes('Timeout')) {
      throw new Error(`Timeout subiendo ${file.originalname}: El archivo es demasiado grande o la conexión es lenta`);
    } else if (error.message.includes('demasiado grande')) {
      throw new Error(`El archivo ${file.originalname} es demasiado grande para Google Drive`);
    } else if (error.message.includes('conexión')) {
      throw new Error(`Error de conexión subiendo ${file.originalname}: ${error.message}`);
    }
    
    throw new Error(`Error subiendo ${file.originalname}: ${error.message}`);
  }
}

/**
 * Obtener todos los formularios
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getAllForms = (req, res) => {
  try {
    const data = readData();
    res.json(data);
  } catch (error) {
    console.error('Error getting all forms:', error);
    res.status(500).json({ error: 'Error al obtener los datos' });
  }
};

/**
 * Obtener un formulario por ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getFormById = (req, res) => {
  try {
    const data = readData();
    const form = data.find(item => item.id === req.params.id);
    
    if (!form) {
      return res.status(404).json({ error: 'Formulario no encontrado' });
    }
    
    res.json(form);
  } catch (error) {
    console.error('Error getting form by ID:', error);
    res.status(500).json({ error: 'Error al obtener el formulario' });
  }
};

/**
 * Crear un nuevo formulario
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const createForm = async (req, res) => {
  try {
    const { textInput1, textInput2 } = req.body;
    console.log('📝 Creando nuevo formulario...');
    
    // Contar archivos totales
    const totalFiles = (req.files?.file1?.length || 0) + 
                      (req.files?.file2?.length || 0) + 
                      (req.files?.multipleFiles?.length || 0);
    console.log(`📎 Total de archivos a procesar: ${totalFiles}`);

    // Subir archivos a Google Drive
    let file1Data = null;
    let file2Data = null;
    let multipleFilesData = [];

    if (req.files?.file1?.[0]) {
      console.log('📤 Subiendo archivo 1...');
      file1Data = await uploadFileToDrive(req.files.file1[0]);
      console.log('✅ Archivo 1 subido exitosamente');
    }

    if (req.files?.file2?.[0]) {
      console.log('📤 Subiendo archivo 2...');
      file2Data = await uploadFileToDrive(req.files.file2[0]);
      console.log('✅ Archivo 2 subido exitosamente');
    }

    if (req.files?.multipleFiles) {
      console.log(`📤 Subiendo ${req.files.multipleFiles.length} archivos múltiples...`);
      for (let i = 0; i < req.files.multipleFiles.length; i++) {
        const file = req.files.multipleFiles[i];
        console.log(`📤 Subiendo archivo múltiple ${i + 1}/${req.files.multipleFiles.length}: ${file.originalname}`);
        const fileData = await uploadFileToDrive(file);
        multipleFilesData.push(fileData);
        console.log(`✅ Archivo múltiple ${i + 1} subido exitosamente`);
      }
    }

    const newForm = {
      id: uuidv4(),
      textInput1,
      textInput2,
      file1: file1Data,
      file2: file2Data,
      multipleFiles: multipleFilesData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const data = readData();
    data.push(newForm);
    writeData(data);

    console.log(`✅ Formulario creado exitosamente: ${newForm.id}`);
    res.status(201).json(newForm);
  } catch (error) {
    console.error('❌ Error creating form:', error);
    
    // Limpiar archivos locales que puedan haber quedado
    if (req.files) {
      ['file1', 'file2', 'multipleFiles'].forEach(fieldName => {
        if (req.files[fieldName]) {
          const files = Array.isArray(req.files[fieldName]) ? req.files[fieldName] : [req.files[fieldName]];
          files.forEach(file => {
            if (file && file.path && fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
              console.log(`🗑️ Archivo local limpiado: ${file.path}`);
            }
          });
        }
      });
    }
    
    res.status(500).json({ error: 'Error al crear el formulario: ' + error.message });
  }
};

/**
 * Actualizar un formulario existente
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const updateForm = async (req, res) => {
  try {
    const { textInput1, textInput2 } = req.body;
    const data = readData();
    const formIndex = data.findIndex(item => item.id === req.params.id);
    
    if (formIndex === -1) {
      return res.status(404).json({ error: 'Formulario no encontrado' });
    }

    const existingForm = data[formIndex];

    // Actualizar campos de texto
    if (textInput1) existingForm.textInput1 = textInput1;
    if (textInput2) existingForm.textInput2 = textInput2;

    // Actualizar archivo 1 si se proporciona uno nuevo
    if (req.files?.file1?.[0]) {
      // Nota: En Drive no eliminamos el archivo anterior automáticamente
      // para mantener historial, pero se podría implementar si se desea
      const file1Data = await uploadFileToDrive(req.files.file1[0]);
      existingForm.file1 = file1Data;
    }

    // Actualizar archivo 2 si se proporciona uno nuevo
    if (req.files?.file2?.[0]) {
      const file2Data = await uploadFileToDrive(req.files.file2[0]);
      existingForm.file2 = file2Data;
    }

    // Actualizar archivos múltiples si se proporcionan nuevos
    if (req.files?.multipleFiles) {
      const multipleFilesData = [];
      for (const file of req.files.multipleFiles) {
        const fileData = await uploadFileToDrive(file);
        multipleFilesData.push(fileData);
      }
      existingForm.multipleFiles = multipleFilesData;
    }

    existingForm.updatedAt = new Date().toISOString();
    writeData(data);

    res.json(existingForm);
  } catch (error) {
    console.error('Error updating form:', error);
    res.status(500).json({ error: 'Error al actualizar el formulario: ' + error.message });
  }
};

/**
 * Eliminar un formulario
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const deleteForm = (req, res) => {
  try {
    const data = readData();
    const formIndex = data.findIndex(item => item.id === req.params.id);
    
    if (formIndex === -1) {
      return res.status(404).json({ error: 'Formulario no encontrado' });
    }

    const formToDelete = data[formIndex];

    // Eliminar archivos asociados
    if (formToDelete.file1) {
      deleteFiles(formToDelete.file1);
    }
    if (formToDelete.file2) {
      deleteFiles(formToDelete.file2);
    }
    if (formToDelete.multipleFiles && formToDelete.multipleFiles.length > 0) {
      deleteFiles(formToDelete.multipleFiles);
    }

    data.splice(formIndex, 1);
    writeData(data);

    res.json({ 
      message: 'Formulario eliminado correctamente',
      id: req.params.id
    });
  } catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({ error: 'Error al eliminar el formulario' });
  }
};
