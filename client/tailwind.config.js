/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8f7f5',
        foreground: '#1d1f24',
        border: '#e8e3de',
        input: '#f3f0ed',
        primary: {
          DEFAULT: '#f06123',
          foreground: '#ffffff',
        },
        secondary: '#fff3ed',
        muted: {
          DEFAULT: '#ece7e2',
          foreground: '#888888',
        },
        card: '#ffffff',
        dark: {
          DEFAULT: '#f0ece8',
          foreground: '#1d1f24',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px'
      }
    }
  }
}
