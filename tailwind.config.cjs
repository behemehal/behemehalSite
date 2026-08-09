/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        // Ported from the original twind.config.ts
        exsm: { max: "540px" },
        smTechCard: "640px",
        mdTechCard: "768px",
        lgTechCard: "1024px",
        xlTechCard: "1280px",
        "2xlTechCard": "1536px",
        "3xl": "1792px",
      },
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
      },
      colors: {
        primary: "#AA2129",
        primaryDark: "#420004",
        techCardColor: "#462B45",
      },
    },
  },
  plugins: [],
};
