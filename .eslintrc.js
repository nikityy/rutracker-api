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
