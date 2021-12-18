'use strict'

import { FsString } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (list->string \'(#\\a #\\b #\\c)) yields "abc"', () => {
  expect(new FBS().eval('(list->string \'(#\\a #\\b #\\c))')).toStrictEqual(new FsString('abc'))
})
