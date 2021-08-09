'use strict'

import { FsNumber } from '../src/sexp.js'
import * as util from './testutil.js'

test('evaluating (mod 3 3) yields 0', () => {
  const code = '(mod 3 3)'
  util.codeEvaledTo(code, new FsNumber(0))
})

test('evaluating (mod 3 1) yields 0', () => {
  const code = '(mod 3 1)'
  util.codeEvaledTo(code, new FsNumber(0))
})

test('evaluating (mod 3 2) yields 1', () => {
  const code = '(mod 3 2)'
  util.codeEvaledTo(code, new FsNumber(1))
})
