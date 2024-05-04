/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,js}", "./src/**/*"],
  theme: {
    extend: {
      colors: {
        primary: "#141D71",
        "gray-shade-1": "#414042",
        "gray-shade-2": "#C3C3C3",
        error: "#A93029",
        success: "#388E3C",
      },
      fontFamily: {
        "TheSans-Plain": ["TheSans-Plain"],
        "TheSans-Bold": ["TheSans-Bold"],
      },
      borderWidth: {
        DEFAULT: "1px",
      },
      boxShadow: {
        1: '0px 3px 20px #65656529',
      },
      animation: {
        fadeIn: "fadeIn 400ms ease-out",
        shake: "shake 0.5s normal",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shake: {
          "25%": { transform: "translate(3px, 0px)" },
          "50%": { transform: "translate(-3px, 0px)" },
          "75%": { transform: "translate(3px, 0px)" },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: { themes: ["light"] },
};
