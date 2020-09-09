const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true
  },
  purge: [],
  theme: {
    extend: {
      fontFamily: {
        kufam: ["Kufam", "sans-serif"],
        sans: ["Kumbh Sans", ...defaultTheme.fontFamily.sans],
        mono: ["Ubuntu Mono", ...defaultTheme.fontFamily.mono]
      }
    },
  },
  variants: {},
  plugins: [],
}
