/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'pacifico': ['Pacifico', 'cursive'],
        'lora': ['Lora', 'serif'],
        'chelsea': ['Chelsea Market', 'serif'],
        'pt-serif': ['PT Serif', 'serif'],
        'lato': ['Lato', 'sans-serif'],
        'quicksand': ['Quicksand', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'hue-rotate': 'hue-rotate 1.5s linear infinite',
        'float': 'float 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'hue-rotate': {
          '100%': { filter: 'hue-rotate(360deg)' }
        },
        'float': {
          '0%': { transform: 'translateY(0)', opacity: '0.7' },
          '100%': { transform: 'translateY(-20px)', opacity: '0.5' }
        }
      },
      backgroundImage: {
        'main-gradient': 'linear-gradient(to bottom, #000759, #1b005b)',
        'reg-gradient': 'linear-gradient(to top, #4d02b1, #001187)',
        'button-gradient': 'linear-gradient(69deg, #0004ed 0%, #010cac 100%)',
        'button-hover': 'linear-gradient(to right, #1CB5E0 0%, #000046 100%)',
        'time-gradient': 'linear-gradient(135deg, rgba(4, 0, 255, 1), rgba(136, 0, 255, 1))',
        'number-hover': 'linear-gradient(90deg, #0025c8, #03e2ff)',
      },
      boxShadow: {
        'custom': '6px 6px 12px #000000',
        'time-box': '0 2px 6px rgba(0, 0, 0, 0.1)',
        'green-glow': '0 4px 15px rgba(0, 200, 83, 0.3)',
      },
      colors: {
        'reg-red': '#870000',
        'reg-brown': '#190A05',
        'reg-orange': '#ff9770',
        'reg-blue': '#0025c8',
        'reg-cyan': '#03e2ff',
      }
    }
  },
  plugins: [],
};
