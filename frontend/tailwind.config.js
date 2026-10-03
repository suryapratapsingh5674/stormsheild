/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        storm: {
          50:  '#f0f4ff',
          100: '#dce8ff',
          200: '#b8d0ff',
          300: '#82abff',
          400: '#4d7fff',
          500: '#1a56ff',
          600: '#0038f5',
          700: '#002bd4',
          800: '#0025ab',
          900: '#001e85',
          950: '#000e4a',
        },
        danger: {
          low:      '#22c55e',
          medium:   '#eab308',
          high:     '#f97316',
          critical: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
