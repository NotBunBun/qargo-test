import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import useBoardStore from '../../store/boardStore';
import ConfirmModal from '../ui/ConfirmModal';
import { EditIcon, TrashIcon, ArchiveIcon } from '../ui/icons';

const NoteCard = ({ note, onEdit, onView }) => {
  const { deleteNote, archiveNote } = useBoardStore();
  const [showActions, setShowActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    await deleteNote(note.id);
  };

  const handleArchive = async () => {
    await archiveNote(note.id);
  };

  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const handleCardClick = (e) => {
    if (!isDragging && onView) {
      onView(note);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className="group cursor-move"
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onClick={handleCardClick}
        className="glass-light rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200 border-l-4"
        style={{ borderLeftColor: note.color || '#3B82F6' }}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white flex-1 break-all">
            {note.title}
          </h3>

          {showActions && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(note);
                }}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Editar nota"
              >
                <EditIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleArchive();
                }}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label={note.is_archived ? 'Desarchivar nota' : 'Archivar nota'}
              >
                <ArchiveIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>

              <button
                onClick={handleDelete}
                className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                aria-label="Eliminar nota"
              >
                <TrashIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>
            </div>
          )}
        </div>

        {note.content && (
          <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-all">
            {truncateContent(note.content)}
          </p>
        )}

        {note.is_archived && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <ArchiveIcon className="w-3 h-3" />
              Archivada
            </span>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            {new Date(note.updated_at).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
            })}
          </span>
        </div>
      </motion.div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Eliminar nota"
        message={`¿Estás seguro de que deseas eliminar la nota "${note.title}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default NoteCard;
