/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'big': 'clamp(5rem, 15vw, 18rem)',
      },
      padding: {
        'fluid-x': 'clamp(1.5rem, 5vw, 5rem)',
        'fluid-y': 'clamp(2rem, 10vh, 10rem)',
      },
    },
  },
  plugins: [],
};
