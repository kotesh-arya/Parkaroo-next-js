/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    // "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        ms: ['Calibri', 'Cambria', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: "#2C3E50",
        secondary: "#3498DB",
        success: "#27AE60",
        alert: "#E74C3C",
        text: "#34495E",
        background: "#ECF0F1",
      },
    },
  },
  plugins: [],
};