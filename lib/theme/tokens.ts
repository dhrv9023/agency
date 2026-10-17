/**
 * ==============================================================================
 * VARAH SYSTEMS — DESIGN TOKENS & SEMANTIC COLOR PALETTE
 * Follows 8px spacing grid, Linear/Vercel density, dark-mode first
 * ==============================================================================
 */

export const DESIGN_TOKENS = {
  colors: {
    dark: {
      bg: {
        base: '#070709',       // Deepest canvas background
        subtle: '#0c0d12',     // Secondary section background
        surface: '#11131a',    // Card and panel surfaces
        elevated: '#171a24',   // Modals, dropdowns, popovers
        hover: '#1d212e',      // Interactive hover state
        active: '#242938',     // Selected / pressed state
      },
      border: {
        subtle: 'rgba(255, 255, 255, 0.06)',
        default: 'rgba(255, 255, 255, 0.10)',
        strong: 'rgba(255, 255, 255, 0.18)',
        focus: '#00f0ff',
      },
      text: {
        primary: '#ffffff',
        secondary: '#9ca3af',
        muted: '#6b7280',
        disabled: '#4b5563',
      },
      brand: {
        primary: '#00f0ff',       // Cyan signal (active states, metrics)
        primaryGlow: 'rgba(0, 240, 255, 0.15)',
        secondary: '#10b981',     // Emerald (success, converted, online)
        secondaryGlow: 'rgba(16, 185, 129, 0.15)',
      },
      semantic: {
        success: '#10b981',
        successBg: 'rgba(16, 185, 129, 0.10)',
        warning: '#f59e0b',
        warningBg: 'rgba(245, 158, 11, 0.10)',
        danger: '#f43f5e',
        dangerBg: 'rgba(244, 63, 94, 0.10)',
        info: '#38bdf8',
        infoBg: 'rgba(56, 189, 248, 0.10)',
      },
    },
    light: {
      bg: {
        base: '#f8fafc',
        subtle: '#f1f5f9',
        surface: '#ffffff',
        elevated: '#ffffff',
        hover: '#f1f5f9',
        active: '#e2e8f0',
      },
      border: {
        subtle: 'rgba(0, 0, 0, 0.06)',
        default: 'rgba(0, 0, 0, 0.12)',
        strong: 'rgba(0, 0, 0, 0.22)',
        focus: '#0284c7',
      },
      text: {
        primary: '#0f172a',
        secondary: '#475569',
        muted: '#64748b',
        disabled: '#94a3b8',
      },
      brand: {
        primary: '#0284c7',
        primaryGlow: 'rgba(2, 132, 199, 0.12)',
        secondary: '#059669',
        secondaryGlow: 'rgba(5, 150, 105, 0.12)',
      },
      semantic: {
        success: '#059669',
        successBg: 'rgba(5, 150, 105, 0.08)',
        warning: '#d97706',
        warningBg: 'rgba(217, 119, 6, 0.08)',
        danger: '#e11d48',
        dangerBg: 'rgba(225, 29, 72, 0.08)',
        info: '#0284c7',
        infoBg: 'rgba(2, 132, 199, 0.08)',
      },
    },
  },
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
  },
  radii: {
    none: '0px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  typography: {
    fontSans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontMono: '"JetBrains Mono", Menlo, Monaco, Consolas, monospace',
    fontDisplay: 'Outfit, Inter, sans-serif',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: '300ms cubic-bezier(0.22, 1, 0.36, 1)',
  },
  shadows: {
    surface: '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
    elevated: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
    glowCyan: '0 0 20px -3px rgba(0, 240, 255, 0.25)',
    glowEmerald: '0 0 20px -3px rgba(16, 185, 129, 0.25)',
  },
} as const;
