/** @type {import('tailwindcss').Config} */
export default {
 content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
 theme: {
  extend: {
    colors: {
      bg: "#030712",
      "text-main": "#f9fafb",
      "text-muted": "#9ca3af",
      accent: "#6366f1",
      glass: "rgba(255,255,255,0.05)",
      "border-subtle": "rgba(255,255,255,0.1)",
    },
  },
},
  plugins: [],
}

