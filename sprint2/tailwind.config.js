/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./layouts/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#121414",
        "surface-lowest": "#0d0e0f",
        "surface-low": "#1a1c1c",
        "surface-high": "#292a2a",
        "on-surface": "#e3e2e2",
        muted: "#c4c7c7",
        aurixBlue: "#14d1ff",
        aurixGreen: "#abd600",
      },
      fontFamily: {
        heading: ["Space Grotesk", "Inter", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(20, 209, 255, 0.24)",
      },
    },
  },
  plugins: [],
};
