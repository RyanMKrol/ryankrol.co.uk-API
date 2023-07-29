module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:jsdoc/recommended', 'airbnb-base'],
  plugins: ['jsdoc'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
  },
};
