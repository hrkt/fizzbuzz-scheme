'use strict'

import { FsString } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (string-append "abc" "def") yields "abcdef"', () => {
  expect(new FBS().eval('(string-append "abc" "def")')).toStrictEqual(new FsString('abcdef'))
})
