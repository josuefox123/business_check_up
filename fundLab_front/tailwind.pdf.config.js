/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/mail/components/pdf-templates/**/*.{js,jsx,ts,tsx}",
  ],
  corePlugins: {
    preflight: false, // Très important pour ne pas casser le CSS existant du projet !
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
