import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import useBoardStore from '../../store/boardStore';
import NoteCard from './NoteCard';
import Button from '../ui/Button';
import ConfirmModal from '../ui/ConfirmModal';
import { EditIcon, TrashIcon, DocumentIcon, PlusIcon } from '../ui/icons';

const Column = ({ column, notes, onEditNote, onViewNote, onCreateNote }) => {
  const { updateColumn, deleteColumn } = useBoardStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [showActions, setShowActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const noteIds = notes.map((note) => note.id);

  const handleSaveTitle = async () => {
    if (title.trim() && title !== column.title) {
      await updateColumn(column.id, { title: title.trim() });
    }
    setIsEditing(false);
  };

  const handleDeleteColumn = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    await deleteColumn(column.id);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setTitle(column.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      className="flex-shrink-0 w-80 h-full"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="glass-light rounded-xl shadow-lg h-full flex flex-col group">
        <div
          className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
          style={{ borderTopColor: column.color, borderTopWidth: '3px' }}
        >
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={handleKeyDown}
              className="flex-1 px-2 py-1 bg-transparent border-b-2 border-blue-500 focus:outline-none text-lg font-semibold text-gray-900 dark:text-white"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-2 flex-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: column.color }}
              />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {column.title}
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({notes.length})
              </span>
            </div>
          )}

          {showActions && !isEditing && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-1"
            >
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Editar columna"
                title="Editar columna"
              >
                <EditIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>

              <button
                onClick={handleDeleteColumn}
                className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                aria-label="Eliminar columna"
                title="Eliminar columna"
              >
                <TrashIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>
            </motion.div>
          )}
        </div>

        <div
          ref={setNodeRef}
          className="flex-1 p-4 overflow-y-auto scrollbar-thin space-y-3"
        >
          <SortableContext items={noteIds} strategy={verticalListSortingStrategy}>
            <AnimatePresence>
              {notes.map((note) => (
                <NoteCard key={note.id} note={note} onEdit={onEditNote} onView={onViewNote} />
              ))}
            </AnimatePresence>
          </SortableContext>

          {notes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <DocumentIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No hay notas en esta columna
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => onCreateNote(column.id)}
            icon={<PlusIcon />}
          >
            Agregar Nota
          </Button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Eliminar columna"
        message={`¿Estás seguro de que deseas eliminar la columna "${column.title}"? Todas las notas en esta columna también se eliminarán.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default Column;
