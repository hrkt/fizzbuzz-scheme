'use strict'

import { FsChar } from '../src/sexp.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating #\\a yields FsChar', () => {
  expect(new FBS().eval('#\\a')).toStrictEqual(new FsChar('a'))
})
