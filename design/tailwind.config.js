/**
 * Triage Desk "Dispatch" — Tailwind consumption of design/tokens.css
 * Tokens stay in CSS custom properties (single source of truth, theme-aware
 * via html[data-theme]); Tailwind utilities reference the variables so
 * `bg-canvas-card text-secondary rounded-strip` is theme-switching for free.
 *
 * Usage: import tokens.css once, then use these utilities anywhere.
 */
module.exports = {
  content: ["./docs/**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
  darkMode: ["selector", '[data-theme="night"]'],
  theme: {
    fontFamily: {
      display: ["Barlow Condensed", "Arial Narrow", "sans-serif"],
      sans: ["Public Sans", "system-ui", "sans-serif"],
      mono: ["JetBrains Mono", "ui-monospace", "monospace"],
    },
    extend: {
      colors: {
        canvas: {
          DEFAULT: "var(--canvas-base)",
          sunken: "var(--canvas-sunken)",
          elevated: "var(--canvas-elevated)",
          card: "var(--canvas-card)",
          "card-hover": "var(--canvas-card-hover)",
          overlay: "var(--canvas-overlay)",
        },
        ink: {
          max: "var(--text-max)",
          DEFAULT: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          disabled: "var(--text-disabled)",
          inverse: "var(--text-inverse)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          pressed: "var(--accent-pressed)",
          text: "var(--accent-text)",
          subtle: "var(--accent-subtle)",
          on: "var(--on-accent)",
        },
        danger: { DEFAULT: "var(--danger)", text: "var(--danger-text)", subtle: "var(--danger-subtle)", ink: "var(--danger-ink)" },
        warning: { DEFAULT: "var(--warning)", text: "var(--warning-text)", subtle: "var(--warning-subtle)", ink: "var(--warning-ink)" },
        success: { DEFAULT: "var(--success)", text: "var(--success-text)", subtle: "var(--success-subtle)", ink: "var(--success-ink)" },
        info: { DEFAULT: "var(--info)", text: "var(--info-text)", subtle: "var(--info-subtle)" },
        priority: {
          high: "var(--p-high)", "high-ink": "var(--p-high-ink)", "high-text": "var(--p-high-text)",
          med: "var(--p-med)", "med-ink": "var(--p-med-ink)", "med-text": "var(--p-med-text)",
          low: "var(--p-low)", "low-ink": "var(--p-low-ink)", "low-text": "var(--p-low-text)",
        },
      },
      borderColor: {
        DEFAULT: "var(--border-default)",
        strong: "var(--border-strong)",
        accent: "var(--accent-border)",
      },
      borderRadius: {
        strip: "var(--radius-xs)",   /* 2px  — strips, holders, chips */
        ui: "var(--radius-sm)",      /* 4px  — buttons, inputs        */
        panel: "var(--radius-md)",   /* 8px  — panels, dialogs        */
      },
      boxShadow: {
        1: "var(--shadow-1)",
        2: "var(--shadow-2)",
        3: "var(--shadow-3)",
        glow: "var(--accent-glow)",
        edge: "var(--inner-edge)",
        focus: "var(--focus-ring)",
      },
      spacing: {
        // 4px grid is Tailwind-native; board-specific layout tokens:
        console: "372px",
      },
      maxWidth: { board: "1180px" },
      fontSize: {
        xs: ["var(--text-xs)", { lineHeight: "1.45" }],
        sm: ["var(--text-sm)", { lineHeight: "1.45" }],
        base: ["var(--text-base)", { lineHeight: "1.55" }],
        md: ["var(--text-md)", { lineHeight: "1.55" }],
        lg: ["var(--text-lg)", { lineHeight: "1.3" }],
        xl: ["var(--text-xl)", { lineHeight: "1.12" }],
        "2xl": ["var(--text-2xl)", { lineHeight: "1.06" }],
        display: ["var(--text-display)", { lineHeight: "1.04" }],
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.2, 0, 0, 1)",
        "out-soft": "cubic-bezier(0.32, 0.72, 0, 1)",
        emphasized: "cubic-bezier(0.05, 0.7, 0.1, 1)",
      },
      transitionDuration: {
        micro: "120ms", small: "200ms", large: "300ms", deal: "240ms", page: "420ms",
      },
      screens: { strip: "560px", board: "1000px" },
    },
  },
  plugins: [],
};
