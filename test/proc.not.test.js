'use strict'

import { FsBoolean } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (not #t) yields #f', () => {
  expect(new FBS().eval('(not #t)')).toStrictEqual(FsBoolean.FALSE)
})

test('evaluating (not #f) yields #t', () => {
  expect(new FBS().eval('(not #f)')).toStrictEqual(FsBoolean.TRUE)
})

test('evaluating (not 1) yields #f', () => {
  expect(new FBS().eval('(not 1)')).toStrictEqual(FsBoolean.FALSE)
})
