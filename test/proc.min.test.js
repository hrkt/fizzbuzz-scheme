'use strict'

import { FsNumber } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (min 1 2 3 4) yields 1', () => {
  const code = '(min 1 2 3 4)'
  expect(new FBS().eval(code)).toStrictEqual(new FsNumber(1))
})
