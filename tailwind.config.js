/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark mode colors (UNCHANGED - your original theme)
        'bg-dark': '#0a0e27',
        'card': '#1a1f3a',
        'brand': '#2a3f5f',
        'primary': '#00d9ff',
        'accent': '#00a2ffff',
        'text': '#e0e7ff',
        'muted': '#8892b0',
        'error': '#ff5555',
        'warning': '#ffaa00',
        
        // Light mode colors (NEW)
        'bg-light': '#f5f7fa',
        'card-light': '#ffffff',
        'brand-light': '#e0e5ec',
        'primary-light': '#0066cc',
        'accent-light': '#00a2ffff',
        'text-light': '#1a202c',
        'muted-light': '#718096',
      }
    },
  },
  plugins: [],
}