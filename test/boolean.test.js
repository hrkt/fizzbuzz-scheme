'use strict'

import { FsBoolean } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating true', () => {
  expect(new FBS().eval('#t')).toStrictEqual(FsBoolean.TRUE)
})

test('evaluating false', () => {
  expect(new FBS().eval('#f')).toStrictEqual(FsBoolean.FALSE)
})

test('evaluating (boolean? #t) yields #t', () => {
  expect(new FBS().eval('(boolean? #t)')).toStrictEqual(FsBoolean.TRUE)
})

test('evaluating (boolean? #f) yields #t', () => {
  expect(new FBS().eval('(boolean? #f)')).toStrictEqual(FsBoolean.TRUE)
})

test('evaluating (boolean? 0) yields #f', () => {
  expect(new FBS().eval('(boolean? 0)')).toStrictEqual(FsBoolean.FALSE)
})
