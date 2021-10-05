'use strict'

import { FsBoolean } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (vector? (vector 1)) yields #t', () => {
  expect(new FBS().eval('(vector? (vector 1))')).toStrictEqual(FsBoolean.TRUE)
})
