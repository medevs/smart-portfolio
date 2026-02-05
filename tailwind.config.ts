import type { Config } from "tailwindcss";

/** @type {import('tailwindcss').Config} */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "Consolas", "Monaco", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Terminal theme colors
        terminal: {
          bg: "hsl(var(--terminal-bg))",
          "bg-alt": "hsl(var(--terminal-bg-alt))",
          border: "hsl(var(--terminal-border))",
          green: "hsl(var(--terminal-green))",
          cyan: "hsl(var(--terminal-cyan))",
          text: "hsl(var(--terminal-text))",
          muted: "hsl(var(--terminal-muted))",
          glow: "hsl(var(--terminal-glow))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "80%": {
            opacity: "0.6",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0px)",
          },
        },
        "cursor-blink": {
          "0%, 50%": {
            opacity: "1",
          },
          "51%, 100%": {
            opacity: "0",
          },
        },
        typing: {
          from: {
            width: "0",
          },
          to: {
            width: "100%",
          },
        },
        "terminal-glow": {
          "0%, 100%": {
            boxShadow:
              "0 0 5px hsl(var(--terminal-green) / 0.3), 0 0 10px hsl(var(--terminal-green) / 0.2), 0 0 15px hsl(var(--terminal-green) / 0.1)",
          },
          "50%": {
            boxShadow:
              "0 0 10px hsl(var(--terminal-green) / 0.5), 0 0 20px hsl(var(--terminal-green) / 0.3), 0 0 30px hsl(var(--terminal-green) / 0.2)",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            opacity: "1",
            filter: "brightness(1)",
          },
          "50%": {
            opacity: "0.8",
            filter: "brightness(1.2)",
          },
        },
        "slide-up": {
          from: {
            opacity: "0",
            transform: "translateY(20px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.3s ease-out",
        "cursor-blink": "cursor-blink 1s infinite",
        typing: "typing 2s steps(40) forwards",
        "terminal-glow": "terminal-glow 2s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "fade-in": "fade-in 0.3s ease-out forwards",
      },
      boxShadow: {
        "terminal-glow":
          "0 0 10px hsl(var(--terminal-green) / 0.3), 0 0 20px hsl(var(--terminal-green) / 0.2)",
        "terminal-glow-lg":
          "0 0 15px hsl(var(--terminal-green) / 0.4), 0 0 30px hsl(var(--terminal-green) / 0.3), 0 0 45px hsl(var(--terminal-green) / 0.2)",
        "cyan-glow":
          "0 0 10px hsl(var(--terminal-cyan) / 0.3), 0 0 20px hsl(var(--terminal-cyan) / 0.2)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
