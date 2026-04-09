module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      ['landing', 'admin', 'donor', 'charity', 'shared', 'deps', 'repo'],
    ],
  },
};
