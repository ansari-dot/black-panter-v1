/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f5f5f3',
        foreground: '#111111',
        border: '#e2e2e0',
        input: '#f0f0ee',
        primary: {
          DEFAULT: '#277eff',
          foreground: '#ffffff',
        },
        secondary: '#fff3ed',
        muted: {
          DEFAULT: '#e8e8e6',
          foreground: '#888888',
        },
        card: '#ffffff',
        dark: {
          DEFAULT: '#f0ece8',
          foreground: '#1d1f24',
        },
        accent: '#c8860a',
        surface: '#ffffff',
        green: {
          DEFAULT: '#22c55e',
          foreground: '#ffffff',
        },
        'tag-bg': '#f5f0e8',
        'tag-text': '#9a6b1e',
        stars: '#f5a623'
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
