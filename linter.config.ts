import type { Options } from '@lumirelle/linter-config'

/**
 * Linter options shared by ESLint and Oxlint.
 */
export const options = {
  vue: true,
  unocss: true,
  typescript: { tsconfigPath: 'tsconfig.json' },
  oxlint: { typeAware: true, typeCheck: true },
  // `.agents` and `.claude` hold vendored skills, not this project's source.
  ignores: ['.agents/**', '.claude/**'],
} satisfies Options

/**
 * The per-file override both Emissions share.
 *
 * `eslint-plugin-unused-imports` analyses the `<script>` block on its own — the `vue-blocks`
 * processor splits the SFC — so a binding a component uses only from its template looks unused, and
 * the rule's fix deletes that import. Both Emissions drop the plugin's rules for Vue files.
 */
export const vueOverride = {
  name: 'project/vue-template-usage',
  files: ['**/*.vue'],
  rules: {
    'unused-imports/no-unused-imports': 'off' as const,
    'unused-imports/no-unused-vars': 'off' as const,
  },
}
