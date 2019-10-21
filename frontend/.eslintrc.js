module.exports = {
  root: true,
  env: {
    browser: true
  },
  extends: ['plugin:vue/essential', '@vue/standard', '@vue/typescript'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'space-before-function-paren': 0
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  }
}
