'use strict'

import { FsException } from '../src/common.js'
import { FsBoolean } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (= 1 1) yields true', () => {
  expect(new FBS().eval('(= 1 1)')).toStrictEqual(FsBoolean.TRUE)
})

test('evaluating (= 1 2) yields false', () => {
  expect(new FBS().eval('(= 1 2)')).toStrictEqual(FsBoolean.FALSE)
})

test('evaluating (= 1 \'a) throws FsException', () => {
  const fbs = new FBS()
  expect(() => { fbs.eval('(= 1 \'a)') }).toThrow(FsException)
})

test('evaluating (= \'a 1) throws FsException', () => {
  const fbs = new FBS()
  expect(() => { fbs.eval('(= \'a 1)') }).toThrow(FsException)
})
