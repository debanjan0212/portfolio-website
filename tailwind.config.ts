import type { Config } from "tailwindcss";

/** rgb(var(--x) / <alpha-value>) so opacity modifiers keep working. */
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          0: token("ink-0"),
          1: token("ink-1"),
          2: token("ink-2"),
          3: token("ink-3"),
        },
        accent: {
          DEFAULT: token("accent"),
          dim: token("accent-dim"),
        },
        ok: token("ok"),
        warn: token("warn"),
        crit: token("crit"),
        hairline: token("hairline"),
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      maxWidth: {
        shell: "76rem",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
