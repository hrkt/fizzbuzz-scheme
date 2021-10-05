'use strict'

import { FsException } from '../src/common.js'
import { FsNumber } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating  (vector-ref \'a 0) throws FsException', () => {
  const code = '(vector-ref \'a 0)'
  expect(() => { new FBS().eval(code) }).toThrow(FsException)
})

test('evaluating (vector-ref \'#(1 2 3) 2) yields 3', () => {
  const code = ' (vector-ref \'#(1 2 3) 2)'
  expect(new FBS().eval(code)).toStrictEqual(new FsNumber(3))
})
