'use strict'

import { FsInteger } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (define a 0) (begin (set! a 1) (set! a 2) (+ a 1)) returns 3', () => {
  const fbs = new FBS()
  fbs.eval('(define a 0)')
  expect(fbs.eval('a')).toStrictEqual(new FsInteger(0))
  expect(fbs.eval('(begin (set! a 1) (set! a 2) (+ a 1))')).toStrictEqual(new FsInteger(3))
  expect(fbs.eval('a')).toStrictEqual(new FsInteger(2))
})
