const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
  },
  purge: [],
  theme: {
    extend: {
      fontFamily: {
        kufam: ["Kufam", "sans-serif"],
        sans: ["Dosis", ...defaultTheme.fontFamily.sans],
        mono: ["Ubuntu Mono", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  variants: {},
  plugins: [],
};
