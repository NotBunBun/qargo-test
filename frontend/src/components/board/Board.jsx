import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import useBoardStore from '../../store/boardStore';
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts';
import Header from '../layout/Header';
import Column from './Column';
import NoteCard from './NoteCard';
import CreateColumnModal from './CreateColumnModal';
import CreateNoteModal from './CreateNoteModal';
import NoteDetailModal from './NoteDetailModal';

const Board = () => {
  const { columns, fetchColumns, fetchNotes, getNotesByColumn, moveNote } = useBoardStore();

  const [showColumnModal, setShowColumnModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchColumns();
    fetchNotes();
  }, [fetchColumns, fetchNotes]);

  const handleCreateNote = useCallback((columnId = null) => {
    setSelectedColumnId(columnId);
    setEditingNote(null);
    setShowNoteModal(true);
  }, []);

  const handleEditNote = useCallback((note) => {
    setEditingNote(note);
    setSelectedColumnId(note.column);
    setShowNoteModal(true);
  }, []);

  const handleViewNote = useCallback((note) => {
    console.log(note.id);
    setSelectedNote(note);
    setShowDetailModal(true);
  }, []);

  const handleCreateColumn = useCallback(() => {
    setShowColumnModal(true);
  }, []);

  useKeyboardShortcuts({
    n: () => handleCreateNote(),
    c: () => handleCreateColumn(),
  });

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeNote = columns
      .flatMap((col) => getNotesByColumn(col.id))
      .find((note) => note.id === active.id);

    console.log(activeNote);
    if (!activeNote) return;

    const overColumn = columns.find((col) => col.id === over.id);
    if (overColumn) {
      const overNotes = getNotesByColumn(overColumn.id);
      const position = overNotes.length;

      if (activeNote.column !== overColumn.id) {
        await moveNote(activeNote.id, overColumn.id, position);
        fetchNotes();
      }
      return;
    }

    const overNote = columns
      ?.flatMap((col) => getNotesByColumn(col.id))
      ?.find((note) => note.id === over.id);

    if (overNote) {
      const targetColumn = columns?.find((col) => col.id === overNote.column);
      if (!targetColumn) return;

      const targetNotes = getNotesByColumn(targetColumn.id);
      const overIndex = targetNotes.findIndex((note) => note.id === over.id);

      if (activeNote.column === targetColumn.id) {
        const activeIndex = targetNotes.findIndex((note) => note.id === active.id);
        if (activeIndex !== overIndex) {
          await moveNote(activeNote.id, targetColumn.id, overIndex);
          fetchNotes();
        }
      } else {
        await moveNote(activeNote.id, targetColumn.id, overIndex);
        fetchNotes();
      }
    }
  };

  const activeNote = activeId
    ? columns
        ?.flatMap((col) => getNotesByColumn(col.id))
        ?.find((note) => note.id === activeId)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header onCreateNote={handleCreateNote} onCreateColumn={handleCreateColumn} />

      <main className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {!Array.isArray(columns) || columns.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="glass-light rounded-2xl p-12 text-center max-w-lg">
                <svg
                  className="w-24 h-24 text-gray-400 dark:text-gray-600 mx-auto mb-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Comienza creando una columna
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Las columnas te ayudan a organizar tus notas de manera efectiva.
                  Presiona <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm font-mono">c</kbd> para crear una.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin min-h-[calc(100vh-12rem)]">
              {Array.isArray(columns) && columns.map((column) => (
                <Column
                  key={column.id}
                  column={column}
                  notes={getNotesByColumn(column.id)}
                  onEditNote={handleEditNote}
                  onViewNote={handleViewNote}
                  onCreateNote={handleCreateNote}
                />
              ))}

              <div className="flex-shrink-0 w-80">
                <button
                  onClick={handleCreateColumn}
                  className="w-full h-full min-h-[200px] glass-light rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 flex flex-col items-center justify-center gap-3 group"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 flex items-center justify-center transition-colors">
                    <svg
                      className="w-8 h-8 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    Nueva Columna
                  </span>
                </button>
              </div>
            </div>
          )}

          <DragOverlay>
            {activeNote ? (
              <div className="opacity-80 rotate-3 scale-105">
                <NoteCard note={activeNote} onEdit={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      <CreateColumnModal
        isOpen={showColumnModal}
        onClose={() => setShowColumnModal(false)}
      />

      <CreateNoteModal
        isOpen={showNoteModal}
        onClose={() => {
          setShowNoteModal(false);
          setEditingNote(null);
          setSelectedColumnId(null);
        }}
        columnId={selectedColumnId}
        editingNote={editingNote}
      />

      <NoteDetailModal
        note={selectedNote}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedNote(null);
        }}
        onEdit={(note) => {
          setShowDetailModal(false);
          handleEditNote(note);
        }}
      />
    </div>
  );
};

export default Board;
