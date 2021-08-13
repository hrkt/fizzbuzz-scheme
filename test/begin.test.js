'use strict'

import * as util from './testutil.js'

import { FsNumber } from '../src/sexp.js'
import { FizzBuzzScheme } from '../src/index.js'

test('evaluating (define a 0) (begin (set! a 1) (set! a 2) (+ a 1)) returns 3', () => {
  const fbs = new FizzBuzzScheme()
  fbs.eval('(define a 0)')
  util.codeEvaledTo('a', new FsNumber(0), fbs)
  const ret = fbs.eval('(begin (set! a 1) (set! a 2) (+ a 1))')
  expect(ret).toStrictEqual(new FsNumber(3))
  util.codeEvaledTo('a', new FsNumber(2), fbs)
})
