/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--border)",
        ring: "var(--brand)",
        background: "var(--bg-base)",
        foreground: "var(--text-primary)",
        primary: {
          DEFAULT: "var(--brand)",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "var(--bg-overlay)",
          foreground: "var(--text-primary)",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "var(--bg-overlay)",
          foreground: "var(--text-muted)",
        },
        accent: {
          DEFAULT: "var(--brand-subtle)",
          foreground: "var(--brand)",
        },
        popover: {
          DEFAULT: "var(--bg-card)",
          foreground: "var(--text-primary)",
        },
        card: {
          DEFAULT: "var(--bg-card)",
          foreground: "var(--text-primary)",
        },
      },
      borderRadius: {
        lg: "var(--radius-xl, 14px)",
        md: "calc(var(--radius-xl, 14px) - 2px)",
        sm: "calc(var(--radius-xl, 14px) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
}
