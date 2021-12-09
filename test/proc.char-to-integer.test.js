'use strict'

import { FsException } from '../src/common.js'
import { FsInteger } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (char->integer #\\a) yields 97', () => {
  expect(new FBS().eval('(char->integer #\\a)')).toStrictEqual(new FsInteger(97))
})

test('evaluating (char->integer #\\a #\\a) throws exception', () => {
  expect(() => { new FBS().eval('(char->integer #\\a #\\a)') }).toThrow(FsException)
})

test('evaluating (char->integer) throws exception', () => {
  expect(() => { new FBS().eval('(char->integer)') }).toThrow(FsException)
})
