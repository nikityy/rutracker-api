module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: [
    'airbnb-base',
    'prettier',
  ],
  plugins: [
    'prettier',
  ],
  rules: {
    'prettier/prettier': 'error',
    'class-methods-use-this': 'off',
  },
  env: {
    node: true
  },
  overrides: [
    {
      files: ['tests/**/*.test.js'],
      env: {
        jest: true,
      }
    }
  ]
};
