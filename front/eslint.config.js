// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

const OFF = 0;
const WARN = 1;
const ERROR = 2;

export default withNuxt({
  rules: {
    // Custom rules from original .eslintrc.js
    "no-path-concat": ERROR,
    "sort-vars": OFF,
    quotes: [WARN, "single"],
    "vue/multi-word-component-names": "off",
  },
});
