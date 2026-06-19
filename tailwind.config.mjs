/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Archivo Black", "sans-serif"],
        mono:    ["Space Mono", "monospace"],
        sans:    ["Space Grotesk", "system-ui", "sans-serif"],
      },
      keyframes: {
        "globe-turn": {
          "0%,100%": { transform: "scaleX(1)" },
          "25%":     { transform: "scaleX(0.06)" },
          "50%":     { transform: "scaleX(1)" },
          "75%":     { transform: "scaleX(0.06)" },
        },
        "iris-sweep": {
          from: { left: "-10rem" },
          to:   { left: "calc(100% + 10rem)" },
        },
        "marquee-scroll": {
  from: { transform: "translateX(0)" },
  to:   { transform: "translateX(-50%)" },
},
        "pip-pulse": {
          "0%,100%": { transform: "scale(1)",   opacity: "1" },
          "50%":     { transform: "scale(1.7)", opacity: "0.5" },
        },
        "avail-ping": {
          "0%":   { boxShadow: "0 0 0 0 rgba(134,239,172,0.75)" },
          "70%":  { boxShadow: "0 0 0 6px rgba(134,239,172,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(134,239,172,0)" },
        },
      },
      animation: {
        "globe":      "globe-turn 5.5s ease-in-out infinite",
        "iris-sweep": "iris-sweep 9s linear infinite",
        "pip":        "pip-pulse 2.8s ease-in-out infinite",
        "avail-ping": "avail-ping 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

