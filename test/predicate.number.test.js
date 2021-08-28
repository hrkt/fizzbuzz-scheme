'use strict'

import * as util from './testutil.js'

import { FsBoolean } from '../src/sexp.js'

test('evaluating (number? 1) yields #t', () => {
  util.codeEvaledTo('(number? 1)', FsBoolean.TRUE)
})

test('evaluating (number? \'a) yields #f', () => {
  util.codeEvaledTo('(number? \'a)', FsBoolean.FALSE)
})
