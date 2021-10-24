'use strict'

import { FsException } from '../src/common.js'
import { FsNumber, FsPair } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('toString pair object with car=1, cons=2 yields (1 . 2)', () => {
  const p = new FsPair(new FsNumber(1), new FsNumber(2))
  expect(p.toString()).toBe('(1 . 2)')
})

test('evaluating (cons 1 2) yields (1 . 2)', () => {
  const code = '(cons 1 2)'
  expect(new FBS().eval(code)).toStrictEqual(new FsPair(new FsNumber(1), new FsNumber(2)))
})

test('get length of proper-list pair success', () => {
  expect(new FBS().eval('(length (cons 1 (cons 2 (cons 3 ()))))')).toStrictEqual(new FsNumber(3))
})

test('get length of improper-list pair throws FSException', () => {
  expect(() => { new FBS().eval('(length (cons 1 2))') }).toThrow(FsException)
})
