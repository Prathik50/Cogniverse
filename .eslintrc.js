module.exports = {
  root: true,
  extends: '@react-native',
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ['module:@react-native/babel-preset'],
    },
    ecmaFeatures: { jsx: true },
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 0,
    'react/react-in-jsx-scope': 'off',
    'react-native/no-inline-styles': 'off',
    'no-unused-vars': 'off',
    'comma-dangle': 'off',
    'no-trailing-spaces': 'off',
    'eol-last': 'off',
  },
};
