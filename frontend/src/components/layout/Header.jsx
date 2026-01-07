import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';
import useBoardStore from '../../store/boardStore';
import SearchBar from '../ui/SearchBar';
import Button from '../ui/Button';
import { exportAsJSON, exportAsMarkdown } from '../../utils/exportNotes';
import { KEYBOARD_SHORTCUTS } from '../../utils/constants';
import {
  DocumentIcon,
  PlusIcon,
  ColumnsIcon,
  DownloadIcon,
  FileIcon,
  SunIcon,
  MoonIcon,
  QuestionIcon,
  LogoutIcon,
} from '../ui/icons';

const Header = ({ onCreateNote, onCreateColumn }) => {
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { columns, notes } = useBoardStore();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const handleExportJSON = () => {
    exportAsJSON(notes, columns);
    setShowExportMenu(false);
  };

  const handleExportMarkdown = () => {
    exportAsMarkdown(notes, columns);
    setShowExportMenu(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 glass-light border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <DocumentIcon className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Qargo Notes
                </h1>
              </div>

              <div className="hidden md:block w-64 lg:w-96">
                <SearchBar />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onCreateNote}
                icon={<PlusIcon />}
              >
                <span className="hidden sm:inline">Nueva Nota</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onCreateColumn}
                icon={<ColumnsIcon />}
              >
                <span className="hidden sm:inline">Nueva Columna</span>
              </Button>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  icon={<DownloadIcon />}
                >
                  <span className="hidden lg:inline">Exportar</span>
                </Button>

                <AnimatePresence>
                  {showExportMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 glass-light rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <button
                        onClick={handleExportJSON}
                        className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                      >
                        <DocumentIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Exportar como JSON
                        </span>
                      </button>
                      <button
                        onClick={handleExportMarkdown}
                        className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                      >
                        <FileIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Exportar como Markdown
                        </span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                icon={isDark ? <SunIcon /> : <MoonIcon />}
              >
                <span className="sr-only">
                  {isDark ? 'Modo claro' : 'Modo oscuro'}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHelp(!showHelp)}
                icon={<QuestionIcon />}
              >
                <span className="sr-only">Ayuda</span>
              </Button>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.username}
                  </span>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 glass-light rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user?.username}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                      >
                        <LogoutIcon className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Cerrar Sesión
                        </span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHelp(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-light rounded-2xl shadow-2xl p-6 max-w-md w-full"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Atajos de Teclado
              </h2>
              <div className="space-y-3">
                {KEYBOARD_SHORTCUTS.map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {shortcut.description}
                    </span>
                    <kbd className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm font-mono">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
              <Button
                variant="primary"
                className="w-full mt-6"
                onClick={() => setShowHelp(false)}
              >
                Cerrar
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
