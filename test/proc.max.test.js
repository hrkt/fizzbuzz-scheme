'use strict'

import { FsInteger } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (max 1 2 3 4) yields 4', () => {
  const code = '(max 1 2 3 4)'
  expect(new FBS().eval(code)).toStrictEqual(new FsInteger(4))
})
