/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "background": "#061A2D",
        "ocean-deep": "#061A2D",
        "ocean-light": "#0A2540",
        "ocean-glow": "#4ECDC4",
        "slate-dark": "#020C16",
        "card-bg": "#0A2540",
        accent: {
          gold: "#D4AF37",
          "gold-hover": "#B89830",
        },
        safe: "#10b981",
        warning: "#f59e0b",
        critical: "#ef4444",
        primary: {
          white: "#ffffff",
          gray: "#9ca3af",
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'hover-scale': 'hover-scale 0.2s ease-in-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'hover-scale': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.02)' },
        }
      }
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
  },
  plugins: [],
}

