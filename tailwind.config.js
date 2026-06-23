/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './containers/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Themeable via CSS variables (dark values == original palette).
        base: 'rgb(var(--base-rgb) / <alpha-value>)',
        surface: 'rgb(var(--surface-rgb) / <alpha-value>)',
        elevated: 'rgb(var(--elevated-rgb) / <alpha-value>)',
        line: 'var(--line)',
        hair: { strong: 'var(--hair-strong)' },
        fill: {
          1: 'var(--fill-1)',
          2: 'var(--fill-2)',
          3: 'var(--fill-3)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent-rgb) / <alpha-value>)',
          // Darker shade for button backgrounds so white text meets WCAG AA.
          strong: 'rgb(var(--accent-strong-rgb) / <alpha-value>)',
          ring: 'rgb(var(--accent-rgb) / 0.35)',
        },
        violet: { DEFAULT: 'rgb(var(--violet-rgb) / <alpha-value>)' },
        success: { DEFAULT: 'rgb(var(--success-rgb) / <alpha-value>)' },
        ink: {
          DEFAULT: 'rgb(var(--ink-rgb) / <alpha-value>)',
          muted: 'rgb(var(--ink-muted-rgb) / <alpha-value>)',
          faint: 'rgb(var(--ink-faint-rgb) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: [
          'var(--font-inter)',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      maxWidth: {
        content: '1180px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        glass: '0 1px 0 0 rgba(255,255,255,0.05) inset, 0 20px 60px -20px rgba(0,0,0,0.6)',
        glow: '0 0 0 1px rgba(59,130,246,0.25), 0 12px 48px -12px rgba(59,130,246,0.45)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', opacity: '0.7' },
          '70%, 100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        // Transform-only (opacity stays 1) so the hero text paints instantly
        // and never gates LCP — it just settles up into place.
        'fade-up': {
          from: { transform: 'translateY(14px)' },
          to: { transform: 'none' },
        },
        'fade-scale': {
          from: { transform: 'scale(0.965)' },
          to: { transform: 'none' },
        },
        'role-in': {
          from: { opacity: '0', transform: 'translateY(0.5em)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'marquee-slow': 'marquee 60s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
        shimmer: 'shimmer 2s infinite',
        'fade-up': 'fade-up 0.4s cubic-bezier(0.21,0.47,0.32,0.98) both',
        'fade-scale': 'fade-scale 0.5s cubic-bezier(0.21,0.47,0.32,0.98) both',
        'role-in': 'role-in 0.4s ease-out',
      },
    },
  },
  plugins: [],
};
