'use strict'

import { FizzBuzzScheme as FBS } from '../src/index.js'
import { FsBoolean } from '../src/sexp.js'

test('evaluating (vector? (vector 1)) yields #t', () => {
  expect(new FBS().eval('(vector? (vector 1))')).toStrictEqual(FsBoolean.TRUE)
})
