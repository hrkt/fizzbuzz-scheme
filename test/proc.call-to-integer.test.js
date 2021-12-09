'use strict'

import { FsInteger } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (char->integer #\\a) yields 97', () => {
  expect(new FBS().eval('(char->integer #\\a)')).toStrictEqual(new FsInteger(97))
})
