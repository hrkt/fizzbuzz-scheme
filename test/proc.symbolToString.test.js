'use strict'

import { FsString } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (symbol->string \'a) yields a', () => {
  const fbs = new FBS()
  fbs.eval('(define a 1)')
  expect(fbs.eval('(symbol->string \'a)')).toStrictEqual(new FsString('a'))
})
