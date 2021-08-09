'use strict'

import { FsBoolean } from '../src/sexp.js'
import * as util from './testutil.js'

test('evaluating (and #t #t) yields #t', () => {
  util.codeEvaledTo('(and #t #t)', FsBoolean.TRUE)
})

test('evaluating (and #t #f) yields #f', () => {
  util.codeEvaledTo('(and #t #f)', FsBoolean.FALSE)
})

test('evaluating (and #f #t) yields #f', () => {
  util.codeEvaledTo('(and #f #t)', FsBoolean.FALSE)
})

test('evaluating (and #f #f) yields #f', () => {
  util.codeEvaledTo('(and #f #f)', FsBoolean.FALSE)
})
