import { create } from 'zustand';
import api from '../services/api';

const normalizeResponse = (response) => response.data.results || response.data || [];

const useBoardStore = create((set, get) => ({
  columns: [],
  notes: [],
  isLoading: false,
  searchQuery: '',
  showArchived: false,

  fetchColumns: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/columns/');
      const columns = normalizeResponse(response);
      console.log(columns);
      set({ columns, isLoading: false });
    } catch (error) {
      set({ columns: [], isLoading: false });
    }
  },

  createColumn: async (title, color = '#3B82F6') => {
    try {
      const response = await api.post('/columns/', { title, color });
      set((state) => ({ columns: [...state.columns, response.data] }));
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  },

  updateColumn: async (id, data) => {
    try {
      const response = await api.put(`/columns/${id}/`, data);
      set((state) => ({
        columns: state.columns.map((column) =>
          column.id === id ? response.data : column
        ),
      }));
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },

  deleteColumn: async (id) => {
    try {
      await api.delete(`/columns/${id}/`);
      set((state) => ({
        columns: state.columns.filter((column) => column.id !== id),
        notes: state.notes.filter((note) => note.column !== id),
      }));
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },

  reorderColumns: async (columnIds) => {
    try {
      await api.patch('/columns/reorder/', { column_ids: columnIds });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },

  fetchNotes: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams();
      if (filters.columnId) params.append('column_id', filters.columnId);
      if (filters.isArchived !== undefined) params.append('is_archived', filters.isArchived);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/notes/?${params.toString()}`);
      set({ notes: normalizeResponse(response), isLoading: false });
    } catch (error) {
      set({ notes: [], isLoading: false });
    }
  },

  createNote: async (noteData) => {
    try {
      const response = await api.post('/notes/', noteData);
      console.log(response.data);
      set((state) => ({ notes: [...state.notes, response.data] }));
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data };
    }
  },

  updateNote: async (id, data) => {
    try {
      const response = await api.put(`/notes/${id}/`, data);
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id ? response.data : note
        ),
      }));
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },

  deleteNote: async (id) => {
    try {
      await api.delete(`/notes/${id}/`);
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
      }));
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },

  moveNote: async (noteId, columnId, position) => {
    try {
      const response = await api.patch(`/notes/${noteId}/move/`, {
        column_id: columnId,
        position,
      });

      console.log(noteId, columnId);
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === noteId ? response.data : note
        ),
      }));

      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },

  archiveNote: async (id) => {
    try {
      const response = await api.patch(`/notes/${id}/archive/`);
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id ? response.data : note
        ),
      }));
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  setShowArchived: (show) => set({ showArchived: show }),

  getFilteredNotes: () => {
    const { notes, searchQuery, showArchived } = get();
    return notes.filter((note) => {
      const matchesSearch =
        !searchQuery ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesArchived = showArchived ? note.is_archived : !note.is_archived;

      return matchesSearch && matchesArchived;
    });
  },

  getNotesByColumn: (columnId) => {
    const filteredNotes = get().getFilteredNotes();
    return filteredNotes.filter((note) => note.column === columnId);
  },
}));

export default useBoardStore;
