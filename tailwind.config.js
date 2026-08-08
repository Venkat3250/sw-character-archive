/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0B0E14',
        panel: '#141926',
        panelRaised: '#1B2131',
        rail: '#232B3D',
        ink: '#EDEEF2',
        muted: '#8A93A6',
        amber: {
          DEFAULT: '#E8A33D',
          soft: '#F2C878',
        },
        cyan: {
          DEFAULT: '#4FD6E8',
          soft: '#9BEAF2',
        },
      },
      fontFamily: {
        display: ['"JetBrains Mono"', '"Space Mono"', 'ui-monospace', 'monospace'],
        body: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(232,163,61,0.25), 0 8px 30px -8px rgba(232,163,61,0.35)',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        riseIn: {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        scan: 'scan 1.4s ease-in-out infinite',
        fadeIn: 'fadeIn 0.15s ease-out',
        riseIn: 'riseIn 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
