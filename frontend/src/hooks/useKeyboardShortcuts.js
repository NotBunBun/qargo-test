import { useEffect } from 'react';

const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      const target = event.target;
      const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (event.key === 'Escape') {
        if (shortcuts.Escape) {
          shortcuts.Escape();
        }
        return;
      }

      if (event.key === '/') {
        if (!isInputField && shortcuts['/']) {
          event.preventDefault();
          shortcuts['/']();
        }
        return;
      }

      if (isInputField) return;

      const handler = shortcuts[event.key];
      if (handler) {
        event.preventDefault();
        handler();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [shortcuts]);
};

export default useKeyboardShortcuts;
