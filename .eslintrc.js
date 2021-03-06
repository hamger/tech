module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true
  },
  extends: ['standard'],
  rules: {
    'generator-star-spacing': 'off',
    'no-new': 0,
    'no-unused-vars': 0,
    'one-var': 0,
    'no-useless-constructor': 0,
    'operator-linebreak': ['error', 'after'],
    'no-proto': 0,
    'new-cap': 0,
    'no-useless-call': 0,
    'comma-dangle': 0,
    'semi': [2, 'never'],
    'no-extend-native': 0,
    'no-trailing-spaces': 0
  }
}
