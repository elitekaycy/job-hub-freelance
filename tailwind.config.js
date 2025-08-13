/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#2563eb",      // blue-600
          primaryDark: "#1e40af",  // blue-800
          accent: "#14B8A6",       // teal-500
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(0,0,0,0.25)"
      }
    }
  },
  plugins: [],
}

