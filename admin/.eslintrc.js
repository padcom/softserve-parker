module.exports = {
  root: true,
  env: {
    browser: true,
  },
  extends: [
    "plugin:vue/essential",
    "@vue/standard",
    "@vue/typescript",
  ],
  rules: {
    "comma-dangle": [ "error", "always-multiline" ],
    "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
    "space-before-function-paren": [ "error", "always" ],
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
}
