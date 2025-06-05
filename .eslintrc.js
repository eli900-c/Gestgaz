module.exports = {
  extends: 'eslint:recommended',
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off', // Désactive l'avertissement pour console.log
  },
  env: {
    node: true, // Spécifique à Node.js
  },
};