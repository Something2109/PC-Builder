/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        card: "var(--card)",
        border: "var(--border)",
        text: "var(--text)",
        line: "var(--line-color)",
        header: "var(--header-bg)",
        navigation: "var(--border)",
        price: "var(--price-color)",
        mint: "var(--accent-mint)",
        accentCyan: "var(--accent-cyan)",
        accentIndigo: "var(--accent-indigo)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-outfit)", "system-ui", "sans-serif"],
      }
    },
  },
  darkMode: "selector",
  plugins: [],
}

