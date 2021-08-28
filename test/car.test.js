'use strict'

import { FizzBuzzScheme as FBS } from '../src/index.js'
import { FsNumber } from '../src/sexp.js'

test('evaluating (car (list 1 2)) yields 1', () => {
  expect(new FBS().eval('(car (list 1 2))')).toStrictEqual(new FsNumber(1))
})
