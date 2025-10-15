import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'

export default tseslint.config({
  extends: [
    eslint.configs.recommended,
    tseslint.configs.recommended
  ],
  plugins: {
    js: eslint,
    '@typescript-eslint': tseslint.plugin,
    '@stylistic': stylistic
  },
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname
    }
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@stylistic/quotes': ['error', 'single'],
    '@stylistic/semi': ['error', 'always'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/no-case-declarations': 'off'
  },
  ignores: ['dist/**/*', 'eslint.config.mjs', 'tests/**/*' ]
})
