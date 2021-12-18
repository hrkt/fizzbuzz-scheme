'use strict'

import { FsString } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (string-fill "abc" #\\z)) change value in string to "zzz"', () => {
  const fbs = new FBS()
  fbs.eval('(define str1 "abc")')
  fbs.eval('(string-fill str1 #\\z)')
  expect(fbs.eval('str1')).toStrictEqual(new FsString('zzz'))
})
