module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'no-console': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/ban-ts-comment': 'error',
    'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
    'max-lines-per-function': ['error', { max: 40, skipBlankLines: true, skipComments: true }],
    'max-depth': ['error', { max: 3 }],
    'max-params': ['error', 4],
    'complexity': ['error', 10],
    'no-restricted-globals': ['error', {
      'name': 'fetch',
      'message': 'Do not use fetch directly. Use the api-client in src/lib/api-client instead.'
    }],
  },
  overrides: [
    {
      files: ['src/lib/api-client/**/*'],
      rules: {
        'no-restricted-globals': 'off',
      },
    },
  ],
}
