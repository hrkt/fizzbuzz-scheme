'use strict'

import { FsBoolean } from '../src/sexp.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (pair? (list 1 2)) yields #t', () => {
  expect(new FBS().eval('(pair? (list 1 2))')).toBe(FsBoolean.TRUE)
})

test('evaluating  (pair? (cons 1 2)) yields #t', () => {
  expect(new FBS().eval(' (pair? (cons 1 2))')).toBe(FsBoolean.TRUE)
})
