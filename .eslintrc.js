module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },

  extends: [
    'plugin:vue/vue3-essential',
    'airbnb-base',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['vue'],
  rules: {
    'no-plusplus': 'off',
    'no-param-reassign': 'off'
  }
}
