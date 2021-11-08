'use strict'

import { FsInteger } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (abs 1) yields 1', () => {
  const code = '(abs 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsInteger(1))
})

test('evaluating (abs -1) yields 1', () => {
  const code = '(abs -1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsInteger(1))
})
