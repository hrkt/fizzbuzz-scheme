'use strict'

import { FizzBuzzScheme as FBS } from '../src/index.js'
import { FsBoolean } from '../src/datatypes.js'

test('evaluating (and #t #t) yields #t', () => {
  expect(new FBS().eval('(and #t #t)')).toBe(FsBoolean.TRUE)
})

test('evaluating (and #t #f) yields #f', () => {
  expect(new FBS().eval('(and #t #f)')).toBe(FsBoolean.FALSE)
})

test('evaluating (and #f #t) yields #f', () => {
  expect(new FBS().eval('(and #f #t)')).toBe(FsBoolean.FALSE)
})

test('evaluating (and #f #f) yields #f', () => {
  expect(new FBS().eval('(and #f #f)')).toBe(FsBoolean.FALSE)
})
