'use strict'

import { FsInteger } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (car (list 1 2)) yields 1', () => {
  expect(new FBS().eval('(car (list 1 2))')).toStrictEqual(new FsInteger(1))
})
