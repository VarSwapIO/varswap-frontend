import type { Config } from "tailwindcss";

const tw_config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'mainColor':'#18d856',
      },
    },
  },
  plugins: [],
  darkMode: ['class', '[data-mantine-color-scheme="dark"]'],
}

export default tw_config;