'use strict'

import { FizzBuzzScheme as FBS } from '../src/index.js'
import { FsBoolean } from '../src/datatypes.js'

test('evaluating (number? 1) yields #t', () => {
  expect(new FBS().eval('(number? 1)')).toStrictEqual(FsBoolean.TRUE)
})

test('evaluating (number? \'a) yields #f', () => {
  expect(new FBS().eval('(number? \'a)')).toStrictEqual(FsBoolean.FALSE)
})
