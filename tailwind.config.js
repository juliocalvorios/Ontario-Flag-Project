/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Ontario flag official colors
        'ontario-red': '#C8102E',
        'ontario-green': '#00573F',
        'ontario-gold': '#FFB81C',
        'union-blue': '#012169',
        'union-red': '#C8102E',
        // Vintage machine aesthetic
        'brass': '#B5A642',
        'brass-dark': '#8B7355',
        'wood': '#8B4513',
        'wood-dark': '#5D3A1A',
        'cream': '#F5F5DC',
        'aged-paper': '#F4ECD8',
      },
      fontFamily: {
        'serif': ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        'mono': ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
