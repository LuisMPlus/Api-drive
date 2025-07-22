import express from 'express';
import { uploadFields } from '../config/multerConfig.js';
import { validateRequiredFields } from '../middlewares/appMiddlewares.js';
import {
  getAllForms,
  getFormById,
  createForm,
  updateForm,
  deleteForm
} from '../controllers/formController.js';

const router = express.Router();

// GET /api/forms - Obtener todos los formularios
router.get('/', getAllForms);

// GET /api/forms/:id - Obtener un formulario por ID
router.get('/:id', getFormById);

// POST /api/forms - Crear nuevo formulario
router.post('/', uploadFields, validateRequiredFields, createForm);

// PUT /api/forms/:id - Actualizar formulario
router.put('/:id', uploadFields, updateForm);

// DELETE /api/forms/:id - Eliminar formulario
router.delete('/:id', deleteForm);

export default router;
