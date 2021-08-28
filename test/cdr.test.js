'use strict'

import { FizzBuzzScheme as FBS } from '../src/index.js'
import { FsNumber, FsList } from '../src/sexp.js'

test('evaluating (cdr (list 1 2)) yields (2)', () => {
  expect(new FBS().eval('(cdr (list 1 2))')).toStrictEqual(new FsList([new FsNumber(2)]))
})
