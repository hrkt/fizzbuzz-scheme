'use strict'

import { FizzBuzzScheme as FBS } from '../src/index.js'

test('vetor-fill! success ', () => {
  const fbs = new FBS()
  fbs.eval('(define a (make-vector 5 1))')
  fbs.eval('(vector-fill! a 2)')
  expect(fbs.eval('a').toString()).toBe('#(2 2 2 2 2)')
})
