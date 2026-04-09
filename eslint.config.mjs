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
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      // 1. Enforce OnPush Change Detection
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',

      // 2. Enforce Standalone Components (Already default in v21, but good for safety)
      '@angular-eslint/prefer-standalone': 'error',

      // 3. Ban @HostListener and @HostBinding in favor of 'host' object
      '@angular-eslint/no-host-metadata-property': 'off', // Turn off the old rule to allow 'host' object
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

      // 4. Clean Code: Ban 'any' and enforce 'unknown'
      '@typescript-eslint/no-explicit-any': 'error',

      // 5. Enforce strict type checking
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        { allowExpressions: true },
      ],
    },
  },
  {
    files: ['**/*.html'],
    rules: {
      // 6. Ban legacy control flow (*ngIf, *ngFor)
      '@angular-eslint/template/no-negated-async': 'error',
      // Note: As of now, there isn't a default lint rule to "hard ban" *ngIf,
      // but the team should strictly use @if/@for as per instructions.
    },
  },
];
