import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Schema de validación con Zod
const formSchema = z.object({
  textInput1: z.string().min(1, 'Este campo es requerido'),
  textInput2: z.string().min(1, 'Este campo es requerido'),
  file1: z.any().optional(),
  file2: z.any().optional(),
  multipleFiles: z.any().optional(),
});

const EditFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm({
    resolver: zodResolver(formSchema)
  });

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/forms/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
          // Llenar el formulario con los datos existentes
          setValue('textInput1', data.textInput1);
          setValue('textInput2', data.textInput2);
        } else {
          throw new Error('Formulario no encontrado');
        }
      } catch (error) {
        setSubmitMessage('Error al cargar el formulario: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchForm();
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      const formDataToSend = new FormData();
      
      // Agregar campos de texto
      formDataToSend.append('textInput1', data.textInput1);
      formDataToSend.append('textInput2', data.textInput2);
      
      // Agregar archivos individuales solo si se seleccionaron nuevos
      if (data.file1?.[0]) {
        formDataToSend.append('file1', data.file1[0]);
      }
      if (data.file2?.[0]) {
        formDataToSend.append('file2', data.file2[0]);
      }
      
      // Agregar múltiples archivos solo si se seleccionaron nuevos
      if (data.multipleFiles && data.multipleFiles.length > 0) {
        Array.from(data.multipleFiles).forEach((file) => {
          formDataToSend.append('multipleFiles', file);
        });
      }

      const response = await fetch(`http://localhost:3001/api/forms/${id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        setSubmitMessage('Formulario actualizado correctamente');
        setTimeout(() => {
          navigate('/list');
        }, 1500);
      } else {
        throw new Error('Error al actualizar el formulario');
      }
    } catch (error) {
      setSubmitMessage('Error al actualizar el formulario: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadFile = (filename, originalname) => {
    window.open(`http://localhost:3001/api/download/${filename}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-700 text-lg">Cargando formulario...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Editar Formulario</h2>
          <p className="mt-2 text-sm text-gray-600">
            Modifica los campos que desees actualizar
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Campo de texto 1 */}
          <div>
            <label htmlFor="textInput1" className="block text-sm font-medium text-gray-700 mb-2">
              Campo de texto 1 *
            </label>
            <input
              {...register('textInput1')}
              type="text"
              id="textInput1"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.textInput1 ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ingresa el primer texto"
            />
            {errors.textInput1 && (
              <p className="mt-1 text-sm text-red-600">{errors.textInput1.message}</p>
            )}
          </div>

          {/* Campo de texto 2 */}
          <div>
            <label htmlFor="textInput2" className="block text-sm font-medium text-gray-700 mb-2">
              Campo de texto 2 *
            </label>
            <input
              {...register('textInput2')}
              type="text"
              id="textInput2"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.textInput2 ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ingresa el segundo texto"
            />
            {errors.textInput2 && (
              <p className="mt-1 text-sm text-red-600">{errors.textInput2.message}</p>
            )}
          </div>

          {/* Archivo 1 */}
          <div>
            <label htmlFor="file1" className="block text-sm font-medium text-gray-700 mb-2">
              Archivo 1
            </label>
            {formData?.file1 && (
              <div className="mb-2 p-2 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-700">
                  Archivo actual: 
                  <button
                    type="button"
                    onClick={() => downloadFile(formData.file1.filename, formData.file1.originalname)}
                    className="ml-1 text-blue-800 underline hover:text-blue-900"
                  >
                    {formData.file1.originalname}
                  </button>
                </p>
                <p className="text-xs text-blue-600">Selecciona un nuevo archivo para reemplazarlo</p>
              </div>
            )}
            <input
              {...register('file1')}
              type="file"
              id="file1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Archivo 2 */}
          <div>
            <label htmlFor="file2" className="block text-sm font-medium text-gray-700 mb-2">
              Archivo 2
            </label>
            {formData?.file2 && (
              <div className="mb-2 p-2 bg-green-50 rounded-md">
                <p className="text-sm text-green-700">
                  Archivo actual: 
                  <button
                    type="button"
                    onClick={() => downloadFile(formData.file2.filename, formData.file2.originalname)}
                    className="ml-1 text-green-800 underline hover:text-green-900"
                  >
                    {formData.file2.originalname}
                  </button>
                </p>
                <p className="text-xs text-green-600">Selecciona un nuevo archivo para reemplazarlo</p>
              </div>
            )}
            <input
              {...register('file2')}
              type="file"
              id="file2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Múltiples archivos */}
          <div>
            <label htmlFor="multipleFiles" className="block text-sm font-medium text-gray-700 mb-2">
              Múltiples archivos
            </label>
            {formData?.multipleFiles && formData.multipleFiles.length > 0 && (
              <div className="mb-2 p-2 bg-purple-50 rounded-md">
                <p className="text-sm text-purple-700 mb-1">Archivos actuales:</p>
                <div className="space-y-1">
                  {formData.multipleFiles.map((file, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => downloadFile(file.filename, file.originalname)}
                      className="block text-xs text-purple-800 underline hover:text-purple-900"
                    >
                      {file.originalname}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-purple-600 mt-1">Selecciona nuevos archivos para reemplazarlos</p>
              </div>
            )}
            <input
              {...register('multipleFiles')}
              type="file"
              id="multipleFiles"
              multiple
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            <p className="mt-1 text-xs text-gray-500">
              Puedes seleccionar múltiples archivos manteniendo presionado Ctrl (Cmd en Mac)
            </p>
          </div>

          {/* Mensaje de estado */}
          {submitMessage && (
            <div className={`p-3 rounded-md ${
              submitMessage.includes('Error') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {submitMessage}
            </div>
          )}

          {/* Botones */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => navigate('/list')}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              } transition duration-150 ease-in-out`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Actualizando...
                </div>
              ) : (
                'Actualizar Formulario'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFormPage;
