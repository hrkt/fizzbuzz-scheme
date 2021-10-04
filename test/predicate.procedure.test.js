'use strict'

import { FsBoolean } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (procedure? 1) yields #f', () => {
  expect(new FBS().eval('(procedure? 1)')).toBe(FsBoolean.FALSE)
  expect(new FBS().eval('(procedure? (lambda (x) (+ x 1)))')).toBe(FsBoolean.TRUE)
})
