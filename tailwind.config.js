/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "background-org": "#171717",
        "background-elm": "#DA0037",
        "background-elm2": "#444444",
        "background-white": "#EDEDED",
      },
      fontFamily: {
        iranSans: ["iran-sans", "sans-serif"],
        iranSansReg: ["iran-sans-reg", "sans-serif"],
      },
      fontSize: {
        h1: "60px",
      },
      borderWidth: {
        1: "1px",
        2: "2px",
        3: "3px",
      },
    },
  },
  plugins: [],
};
