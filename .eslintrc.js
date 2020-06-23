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
  },
};
