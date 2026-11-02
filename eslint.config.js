// @ts-check
import { eslint } from '@lumirelle/linter-config/eslint'
import { options, vueOverride } from './linter.config.ts'

export default eslint(options).append(vueOverride)
