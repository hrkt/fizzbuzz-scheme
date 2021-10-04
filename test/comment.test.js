'use strict'

import FS from 'fs'

import { FizzBuzzScheme as FBS } from '../src/index.js'
import { FsNumber } from '../src/datatypes.js'

test('evaluating comment.test.1.scm', () => {
  const code1 = FS.readFileSync('test/code/comment.test.1.scm', 'utf8')
  expect(new FBS().eval(code1)).toStrictEqual(new FsNumber(2))
})
