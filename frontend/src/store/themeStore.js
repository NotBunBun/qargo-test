import { create } from 'zustand';

const applyTheme = (isDark) => {
  const method = isDark ? 'add' : 'remove';
  document.documentElement.classList[method]('dark');
  document.body.classList[method]('dark');
};

const useThemeStore = create((set) => {
  const savedTheme = localStorage.getItem('theme');
  const initialIsDark = savedTheme === 'dark' || (!savedTheme && true);

  applyTheme(initialIsDark);

  return {
    isDark: initialIsDark,

    toggleTheme: () => set((state) => {
      const newIsDark = !state.isDark;
      localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
      applyTheme(newIsDark);
      return { isDark: newIsDark };
    }),

    setTheme: (isDark) => set(() => {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      applyTheme(isDark);
      return { isDark };
    }),
  };
});

export default useThemeStore;
