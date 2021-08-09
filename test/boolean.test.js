'use strict'

import * as util from './testutil.js'

import { FsBoolean } from '../src/sexp.js'

test('evaluating true', () => {
  const code = '#t'
  util.codeEvaledTo(code, FsBoolean.TRUE)
})

test('evaluating false', () => {
  const code = '#f'
  util.codeEvaledTo(code, FsBoolean.FALSE)
})
