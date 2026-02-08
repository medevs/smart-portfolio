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
        // Surface colors for themed backgrounds
        surface: {
          primary: "hsl(var(--surface-primary))",
          secondary: "hsl(var(--surface-secondary))",
          elevated: "hsl(var(--surface-elevated))",
        },
        // Card theme colors
        "card-theme": {
          bg: "hsl(var(--card-bg))",
          border: "hsl(var(--card-border))",
        },
        // Inner card colors (sub-surfaces inside bento cards)
        "inner-card": {
          bg: "hsl(var(--inner-card-bg))",
          border: "hsl(var(--inner-card-border))",
        },
        // Glass effect colors
        glass: {
          bg: "hsl(var(--glass-bg))",
          border: "hsl(var(--glass-border))",
        },
        // Products section colors
        products: {
          bg: "hsl(var(--products-bg))",
          overlay: "hsl(var(--products-overlay))",
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
        "shimmer": {
          "0%": {
            backgroundPosition: "-200% 0",
          },
          "100%": {
            backgroundPosition: "200% 0",
          },
        },
        "scale-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.9)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        "spin-slow": {
          from: {
            transform: "rotate(0deg)",
          },
          to: {
            transform: "rotate(360deg)",
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
        "float": {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(0,255,136,0.3)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(0,255,136,0.5)",
          },
        },
        "gradient-x": {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
        },
        "slide-up-fade": {
          from: {
            opacity: "0",
            transform: "translateY(8px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
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
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "gradient-x": "gradient-x 3s ease infinite",
        "slide-up-fade": "slide-up-fade 0.4s ease-out",
        "shimmer": "shimmer 2s linear infinite",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "spin-slow": "spin-slow 20s linear infinite",
      },
      boxShadow: {
        "terminal-glow":
          "0 0 10px hsl(var(--terminal-green) / 0.3), 0 0 20px hsl(var(--terminal-green) / 0.2)",
        "terminal-glow-lg":
          "0 0 15px hsl(var(--terminal-green) / 0.4), 0 0 30px hsl(var(--terminal-green) / 0.3), 0 0 45px hsl(var(--terminal-green) / 0.2)",
        "cyan-glow":
          "0 0 10px hsl(var(--terminal-cyan) / 0.3), 0 0 20px hsl(var(--terminal-cyan) / 0.2)",
        "glass": "0 8px 32px rgba(0,0,0,0.3)",
        "glass-hover": "0 8px 32px rgba(0,255,136,0.1)",
        "chat-panel": "0 25px 50px -12px rgba(0,0,0,0.5)",
        "chat-button": "0 0 30px rgba(0,255,136,0.4)",
        "chat-button-hover": "0 0 40px rgba(0,255,136,0.6)",
      },
      backdropBlur: {
        "xl": "20px",
        "2xl": "40px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
