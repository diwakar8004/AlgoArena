import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  login: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    set({ user: null, token: null, isAuthenticated: false });
  },
  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
}));

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem('theme') || 'dark',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    return { theme: newTheme };
  }),
}));

export const useBookmarkStore = create((set, get) => ({
  bookmarks: JSON.parse(localStorage.getItem('bookmarks') || '[]'),
  solved: JSON.parse(localStorage.getItem('solved') || '[]'),
  attempted: JSON.parse(localStorage.getItem('attempted') || '[]'),
  toggleBookmark: (id) => set((state) => {
    const bookmarks = state.bookmarks.includes(id) ? state.bookmarks.filter(b => b !== id) : [...state.bookmarks, id];
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    return { bookmarks };
  }),
  markSolved: (id) => set((state) => {
    const solved = state.solved.includes(id) ? state.solved : [...state.solved, id];
    localStorage.setItem('solved', JSON.stringify(solved));
    return { solved };
  }),
  markAttempted: (id) => set((state) => {
    const attempted = state.attempted.includes(id) ? state.attempted : [...state.attempted, id];
    localStorage.setItem('attempted', JSON.stringify(attempted));
    return { attempted };
  }),
}));
