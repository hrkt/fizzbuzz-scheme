'use strict'

import * as util from './testutil.js'

import { FsNumber } from '../src/sexp.js'

test('evaluating (if #t 1 2) yields 1', () => {
  const code = '(if #t 1 2)'
  util.codeEvaledTo(code, new FsNumber(1))
})

test('evaluating (if #f 1 2) yields 2', () => {
  const code = '(if #f 1 2)'
  util.codeEvaledTo(code, new FsNumber(2))
})
