import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            // --- SCOPE BOUNDARIES ---
            {
              sourceTag: 'scope:admin',
              onlyDependOnLibsWithTags: ['scope:admin', 'scope:shared'],
            },
            {
              sourceTag: 'scope:donor',
              onlyDependOnLibsWithTags: ['scope:donor', 'scope:shared'],
            },
            {
              sourceTag: 'scope:charity',
              onlyDependOnLibsWithTags: ['scope:charity', 'scope:shared'],
            },
            {
              sourceTag: 'scope:landing',
              onlyDependOnLibsWithTags: ['scope:landing', 'scope:shared'],
            },
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },

            // --- TYPE BOUNDARIES ---
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: [
                'type:feature',
                'type:ui',
                'type:data-access',
                'type:util',
                'type:core',
              ],
            },
            {
              sourceTag: 'type:core',
              onlyDependOnLibsWithTags: ['type:data-access', 'type:util'],
            },
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: [
                'type:feature',
                'type:ui',
                'type:data-access',
                'type:util',
              ],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:ui', 'type:util'],
            },
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: ['type:data-access', 'type:util'],
            },
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: ['type:util'],
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@angular-eslint/prefer-standalone': 'error',
      '@angular-eslint/no-host-metadata-property': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: "Decorator[expression.callee.name='HostListener']",
          message:
            "Do NOT use @HostListener. Use the 'host' object in @Component or @Directive instead.",
        },
        {
          selector: "Decorator[expression.callee.name='HostBinding']",
          message:
            "Do NOT use @HostBinding. Use the 'host' object in @Component or @Directive instead.",
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        { allowExpressions: true },
      ],
    },
  },
  {
    files: ['**/*.html'],
    rules: {
      '@angular-eslint/template/no-negated-async': 'error',
      // Note: As of now, there isn't a default lint rule to "hard ban" *ngIf,
      // but the team should strictly use @if/@for as per instructions.
    },
  },
];
