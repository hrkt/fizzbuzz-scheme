'use strict'

import { FsBoolean } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (string-copy "abc")) yields newly allocated "abc"', () => {
  const fbs = new FBS()
  fbs.eval('(define str1 "abc")')
  fbs.eval('(define str2 (string-copy str1))')
  expect(fbs.eval('(eq? str1 str2)')).toStrictEqual(FsBoolean.FALSE)
})
