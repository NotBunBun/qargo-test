import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import Button from '../ui/Button';
import Input from '../ui/Input';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: '',
    checks: {
      minLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false,
    },
  });

  const checkPasswordStrength = (password) => {
    const checks = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;

    let label = '';
    if (score === 0) label = '';
    else if (score <= 2) label = 'Débil';
    else if (score <= 3) label = 'Media';
    else if (score <= 4) label = 'Buena';
    else label = 'Excelente';

    setPasswordStrength({ score, label, checks });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'password') {
      checkPasswordStrength(value);
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    clearError();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!formData.password2) {
      newErrors.password2 = 'Debes confirmar tu contraseña';
    } else if (formData.password !== formData.password2) {
      newErrors.password2 = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await register(
      formData.username,
      formData.email,
      formData.password,
      formData.password2
    );

    if (result.success) {
      navigate('/board');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-light rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Qargo Notes
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Crea tu cuenta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 rounded-lg"
              >
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </motion.div>
            )}

            <Input
              label="Nombre de usuario"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Elige un nombre de usuario"
              error={errors.username}
              required
              autoComplete="username"
            />

            <Input
              label="Correo electrónico"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              error={errors.email}
              required
              autoComplete="email"
            />

            <Input
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 8 caracteres"
              error={errors.password}
              required
              autoComplete="new-password"
            />

            {formData.password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Seguridad de la contraseña:
                    </span>
                    {passwordStrength.label && (
                      <span
                        className={`text-sm font-medium ${
                          passwordStrength.score <= 2
                            ? 'text-red-600 dark:text-red-400'
                            : passwordStrength.score <= 3
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : passwordStrength.score <= 4
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-green-600 dark:text-green-400'
                        }`}
                      >
                        {passwordStrength.label}
                      </span>
                    )}
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      transition={{ duration: 0.3 }}
                      className={`h-full ${
                        passwordStrength.score <= 2
                          ? 'bg-red-500'
                          : passwordStrength.score <= 3
                          ? 'bg-yellow-500'
                          : passwordStrength.score <= 4
                          ? 'bg-blue-500'
                          : 'bg-green-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className={`${
                        passwordStrength.checks.minLength
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-400 dark:text-gray-600'
                      }`}
                    >
                      {passwordStrength.checks.minLength ? '✓' : '○'}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      Mínimo 8 caracteres
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`${
                        passwordStrength.checks.hasUpperCase
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-400 dark:text-gray-600'
                      }`}
                    >
                      {passwordStrength.checks.hasUpperCase ? '✓' : '○'}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      Una letra mayúscula
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`${
                        passwordStrength.checks.hasLowerCase
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-400 dark:text-gray-600'
                      }`}
                    >
                      {passwordStrength.checks.hasLowerCase ? '✓' : '○'}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      Una letra minúscula
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`${
                        passwordStrength.checks.hasNumber
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-400 dark:text-gray-600'
                      }`}
                    >
                      {passwordStrength.checks.hasNumber ? '✓' : '○'}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      Un número
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`${
                        passwordStrength.checks.hasSpecialChar
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-400 dark:text-gray-600'
                      }`}
                    >
                      {passwordStrength.checks.hasSpecialChar ? '✓' : '○'}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      Un carácter especial (!@#$%^&*)
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <Input
              label="Confirmar contraseña"
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              error={errors.password2}
              required
              autoComplete="new-password"
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creando cuenta...' : 'Registrarse'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿Ya tienes una cuenta?{' '}
              <Link
                to="/login"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterForm;
