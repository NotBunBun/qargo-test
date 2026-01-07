import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useBoardStore from '../../store/boardStore';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { PRESET_COLORS } from '../../utils/constants';

const CreateColumnModal = ({ isOpen, onClose }) => {
  const { createColumn } = useBoardStore();

  const [formData, setFormData] = useState({
    title: '',
    color: PRESET_COLORS[0].value,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        color: PRESET_COLORS[0].value,
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (formData.title.length > 50) {
      newErrors.title = 'El título no puede exceder 50 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    const result = await createColumn(formData.title.trim(), formData.color);
    console.log(result);
    setIsLoading(false);

    if (result.success) {
      onClose();
    } else {
      setErrors({ title: 'Error al crear la columna. Intenta nuevamente.' });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nueva Columna" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Título de la columna"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ej: Por hacer, En progreso, Completado"
          error={errors.title}
          required
          autoFocus
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Color de la columna
          </label>
          <div className="grid grid-cols-4 gap-3">
            {PRESET_COLORS.map((color) => (
              <motion.button
                key={color.value}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, color: color.value }))}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative h-12 rounded-lg transition-all duration-200 ${
                  formData.color === color.value
                    ? 'ring-4 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800'
                    : 'ring-2 ring-gray-300 dark:ring-gray-600 hover:ring-gray-400 dark:hover:ring-gray-500'
                }`}
                style={{ backgroundColor: color.value }}
                aria-label={color.name}
              >
                {formData.color === color.value && (
                  <svg
                    className="absolute inset-0 m-auto w-6 h-6 text-white drop-shadow-lg"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </motion.button>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              O elige un color personalizado:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                    setFormData((prev) => ({ ...prev, color: value }));
                  }
                }}
                placeholder="#3B82F6"
                className="w-28 px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase"
                maxLength={7}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? 'Creando...' : 'Crear Columna'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateColumnModal;
