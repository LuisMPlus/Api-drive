import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Archivo JSON para almacenar datos
const dataFile = path.join(__dirname, '../../data.json');

/**
 * Función para leer datos del archivo JSON
 * @returns {Array} Array de formularios
 */
export const readData = () => {
  try {
    if (!fs.existsSync(dataFile)) {
      fs.writeFileSync(dataFile, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return [];
  }
};

/**
 * Función para escribir datos al archivo JSON
 * @param {Array} data - Array de formularios a guardar
 */
export const writeData = (data) => {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data:', error);
  }
};

/**
 * Función para eliminar archivos del sistema de archivos
 * @param {Object|Array} files - Archivo o array de archivos a eliminar
 */
export const deleteFiles = (files) => {
  try {
    if (Array.isArray(files)) {
      files.forEach(file => {
        if (file?.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    } else if (files?.path && fs.existsSync(files.path)) {
      fs.unlinkSync(files.path);
    }
  } catch (error) {
    console.error('Error deleting files:', error);
  }
};
