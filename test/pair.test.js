'use strict'

import { FsException } from '../src/common.js'
import { FsInteger, FsList, FsPair } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('toString pair object with car=1, cons=2 yields (1 . 2)', () => {
  const p = new FsPair(new FsInteger(1), new FsInteger(2))
  expect(p.toString()).toBe('(1 . 2)')
})

test('evaluating (cons 1 2) yields (1 . 2)', () => {
  const code = '(cons 1 2)'
  expect(new FBS().eval(code)).toStrictEqual(new FsPair(new FsInteger(1), new FsInteger(2)))
})

test('get length of proper-list pair success', () => {
  expect(new FBS().eval('(length (cons 1 (cons 2 (cons 3 ()))))')).toStrictEqual(new FsInteger(3))
})

test('get length of improper-list pair throws FSException', () => {
  expect(() => { new FBS().eval('(length (cons 1 2))') }).toThrow(FsException)
})

test('get entries of pair (1 . 2) returns [1, 2]', () => {
  expect(new FsPair(1, 2).entries()).toStrictEqual([1, 2])
})

test('get entries of pair (1 . ()) returns [1]', () => {
  expect(new FsPair(1, FsList.EMPTY).entries()).toStrictEqual([1])
})

test('get entries of pair (() . ()) returns []', () => {
  expect(new FsPair(FsList.EMPTY, FsList.EMPTY).entries()).toStrictEqual([])
})

test('get entries of pair (1 2 . 3) returns [1]', () => {
  expect(new FsPair(1, new FsPair(2, 3)).entries()).toStrictEqual([1, 2, 3])
})
