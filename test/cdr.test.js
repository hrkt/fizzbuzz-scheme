'use strict'

import { FsInteger, FsList } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (cdr (list 1 2)) yields (2)', () => {
  expect(new FBS().eval('(cdr (list 1 2))')).toStrictEqual(new FsList([new FsInteger(2)]))
})
