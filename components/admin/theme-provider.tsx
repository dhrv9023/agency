'use client';

/**
 * ==============================================================================
 * VARAH SYSTEMS — THEME PROVIDER & PERSISTENCE ENGINE
 * Zero-FOUC, dark-mode first, system preference sync, local storage
 * ==============================================================================
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';
type ResolvedTheme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'varah_admin_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read persisted theme (checks admin key, falls back to public agency_theme)
    const saved = (localStorage.getItem(STORAGE_KEY) || localStorage.getItem('agency_theme')) as Theme | null;
    const initialTheme: Theme = saved && ['dark', 'light', 'system'].includes(saved) ? saved : 'dark';
    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);

    // System preference change listener
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      const current = (localStorage.getItem(STORAGE_KEY) || localStorage.getItem('agency_theme')) as Theme | null;
      if (current === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);

  const applyTheme = (targetTheme: Theme) => {
    const root = document.documentElement;
    let effective: ResolvedTheme = 'dark';

    if (targetTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effective = prefersDark ? 'dark' : 'light';
    } else {
      effective = targetTheme;
    }

    setResolvedTheme(effective);
    if (effective === 'light') {
      root.setAttribute('data-theme', 'light');
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.removeAttribute('data-theme');
      root.classList.add('dark');
      root.classList.remove('light');
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    localStorage.setItem('agency_theme', newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const next: Theme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
