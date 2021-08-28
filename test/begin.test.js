'use strict'

import { FsNumber } from '../src/sexp.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (define a 0) (begin (set! a 1) (set! a 2) (+ a 1)) returns 3', () => {
  const fbs = new FBS()
  fbs.eval('(define a 0)')
  expect(fbs.eval('a')).toStrictEqual(new FsNumber(0), fbs)
  expect(fbs.eval('(begin (set! a 1) (set! a 2) (+ a 1))')).toStrictEqual(new FsNumber(3))
  expect(fbs.eval('a')).toStrictEqual(new FsNumber(2), fbs)
})
