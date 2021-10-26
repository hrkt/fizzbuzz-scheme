'use strict'

import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating vetor-set! success) yields ', () => {
  expect(new FBS().eval('(let ((vec (vector 1 2 3))) (vector-set! vec 2 4) vec)').toString()).toBe('#(1 2 4)')
})
