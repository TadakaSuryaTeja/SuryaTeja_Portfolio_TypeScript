import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';

function setTheme(toLight: boolean) {
  document.documentElement.classList.toggle('light', toLight);
  try {
    localStorage.setItem('theme', toLight ? 'light' : 'dark');
  } catch {
    /* storage unavailable */
  }
}

export default function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.classList.contains('light'));
    const onToggle = () => {
      const next = !document.documentElement.classList.contains('light');
      setTheme(next);
      setLight(next);
    };
    window.addEventListener('theme:toggle', onToggle);
    return () => window.removeEventListener('theme:toggle', onToggle);
  }, []);

  const toggle = () => {
    setTheme(!light);
    setLight(!light);
  };

  return (
    <button
      onClick={toggle}
      aria-label={light ? 'Switch to dark theme' : 'Switch to light theme'}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-fill-2 text-ink-muted transition-colors hover:border-hair-strong hover:text-ink"
    >
      <Icon
        icon={light ? 'ph:moon-stars-bold' : 'ph:sun-bold'}
        className="text-base"
        aria-hidden
      />
    </button>
  );
}
