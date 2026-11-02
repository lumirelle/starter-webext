// @ts-check
import { oxlint } from '@lumirelle/linter-config/oxlint'
import { options, vueOverride } from './linter.config.ts'

export default oxlint(options).append(vueOverride)
