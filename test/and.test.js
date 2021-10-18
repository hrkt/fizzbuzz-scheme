'use strict'

import { FsBoolean } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

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

test('evaluating (and #f) yields #f', () => {
  expect(new FBS().eval('(and #f)')).toBe(FsBoolean.FALSE)
})

test('evaluating (and #t) yields #t', () => {
  expect(new FBS().eval('(and #t)')).toBe(FsBoolean.TRUE)
})
