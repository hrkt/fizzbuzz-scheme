'use strict'

import { FsNumber } from '../src/sexp.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (max 1 2 3 4) yields 4', () => {
  const code = '(max 1 2 3 4)'
  expect(new FBS().eval(code)).toStrictEqual(new FsNumber(4))
})
