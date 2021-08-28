'use strict'

import * as util from './testutil.js'

import { FsBoolean } from '../src/sexp.js'
import { FizzBuzzScheme } from '../src/index.js'

test('evaluating (symbol? 1) yields #f', () => {
  util.codeEvaledTo('(symbol? 1)', FsBoolean.FALSE)
})

test('evaluating (symbol? a) yields #f', () => {
  const fbs = new FizzBuzzScheme()
  fbs.eval('(define a 1)')
  util.codeEvaledTo('(symbol? a)', FsBoolean.FALSE, fbs)
})

test('evaluating (symbol? \'a) yields #t', () => {
  util.codeEvaledTo('(symbol? \'a)', FsBoolean.TRUE)
})
