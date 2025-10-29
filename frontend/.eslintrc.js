module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    'react/prop-types': 'warn',
    'react/no-unescaped-entities': 'warn',
    'no-unused-vars': 'warn',
    'react-hooks/exhaustive-deps': 'warn'
  }
}
