module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ivory: "#F6EFE6", claret: "#5B1F2E", rose: "#C99A9A", champagne: "#C8AA7A", brand: "#5B1F2E", accent: "#5B1F2E" },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "Cambria", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-up": { "0%": { opacity: "0", transform: "translateY(24px)" }, "100%": { opacity: "1", transform: "none" } },
        pop: { "0%": { transform: "scale(.6)" }, "60%": { transform: "scale(1.25)" }, "100%": { transform: "scale(1)" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
      },
      animation: {
        "fade-up": "fade-up .9s ease-out both",
        pop: "pop .35s ease-out",
        marquee: "marquee 30s linear infinite",
        float: "float 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
