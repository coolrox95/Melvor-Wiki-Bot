module.exports = {
  'env': {
    'browser': true,
    'es2020': true,
  },
  'extends': [
    'google',
  ],
  'parserOptions': {
    'ecmaVersion': 11,
  },
  'rules': {
    'linebreak-style': 'off',
    'max-len': ['off', {
      'code': 250,
    }],
    'no-unused-vars': 'off',
    'object-shorthand': 'error',
    'no-else-return': 'error',
    'no-useless-return': 'error',
    'no-dupe-keys': 'error',
    'prefer-template': 'error',
    'template-curly-spacing': ['error', 'never'],
    'no-extra-semi': 'error',
    'prefer-destructuring': ['warn', {'object': true, 'array': false}],
    'space-infix-ops': 'error',
    // 'no-await-in-loop': 'warn',
    // 'require-atomic-updates': 'warn',
    'no-use-before-define': 'warn',
    // 'no-magic-numbers': ['warn', {'ignoreArrayIndexes': true, 'ignore': [0, 1]}],
    'eqeqeq': 'warn',
  },
};
