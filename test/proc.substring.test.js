'use strict'

import { FsString } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (substring "12345" 2 4) yields "34"', () => {
  expect(new FBS().eval('(substring "12345" 2 4)')).toStrictEqual(new FsString('34'))
})
