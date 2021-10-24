'use strict'

import { FsList, FsNumber, FsPair, FsString, isProperList } from '../src/datatypes.js'

test('null is not a proper list', () => {
  expect(isProperList(null)).toBe(false)
})

test('FsList is a proper list', () => {
  expect(isProperList(new FsList([]))).toBe(true)
})

test('(1 . 2) is not a proper list', () => {
  const p = new FsPair(new FsNumber(1), new FsNumber(2))
  expect(isProperList(p)).toBe(false)
})

test('(1 . ()) is  a proper list', () => {
  const p = new FsPair(new FsNumber(1), FsList.EMPTY)
  expect(isProperList(p)).toBe(true)
})

test('FsString is not a proper list', () => {
  expect(isProperList(new FsString(''))).toBe(false)
})

