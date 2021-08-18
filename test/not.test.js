'use strict'

import { FsBoolean } from '../src/sexp.js'
import * as util from './testutil.js'

test('evaluating (not #t) yields #f', () => {
  util.codeEvaledTo('(not #t)', FsBoolean.FALSE)
})

test('evaluating (not #f) yields #t', () => {
  util.codeEvaledTo('(not #f)', FsBoolean.TRUE)
})

test('evaluating (not 1) yields #f', () => {
  util.codeEvaledTo('(not 1)', FsBoolean.FALSE)
})
