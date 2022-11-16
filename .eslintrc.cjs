/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-recommended',
    './.eslintrc-auto-import.json'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    semi: [2, 'never'],
    quotes: [2, 'single'],
    'vue/multi-word-component-names': 'off',
    'no-debugger': 'off',
    'vue/max-attributes-per-line': ['error', {
      'singleline': {
        'max': 4
      },      
      'multiline': {
        'max': 1
      }
    }]
  }
}
