'use strict'

import { FsInteger, FsReal } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (round 1.5) yields 1', () => {
  const code = '(round 1)'
  expect(new FBS().eval(code)).toStrictEqual(new FsInteger(1))
})

test('evaluating (abs 0.9) yields 0.9', () => {
  const code = '(round 0.9)'
  expect(new FBS().eval(code)).toStrictEqual(new FsReal(0.9))
})
