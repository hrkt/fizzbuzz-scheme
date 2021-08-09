'use strict'

import * as util from './testutil.js'

import { FsBoolean } from '../src/sexp.js'

test('evaluating (= 1 1) yields true', () => {
  const code = '(= 1 1)'
  util.codeEvaledTo(code, FsBoolean.TRUE)
})

test('evaluating (= 1 2) yields false', () => {
  const code = '(= 1 2)'
  util.codeEvaledTo(code, FsBoolean.FALSE)
})
