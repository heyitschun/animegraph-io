const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  purge: {
    enabled: false,
    content: [
      "./src/**/*.html",
      "./src/**/*.js"
    ]
  },
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
