import { useEffect, useState } from 'react';
import './ThemeToggle.css';

// Roman-Urdu: Theme toggle component - simple aur samajh mein aasan
export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('themeDark');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add('theme-dark');
    else root.classList.remove('theme-dark');
    localStorage.setItem('themeDark', JSON.stringify(dark));
  }, [dark]);

  return (
    <button
      className={`theme-toggle ${dark ? 'dark' : 'light'}`}
      aria-pressed={dark}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => setDark((v) => !v)}
    >
      {dark ? '🌙' : '☀️'}
    </button>
  );
}
