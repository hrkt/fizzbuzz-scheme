'use strict'

import { FsException } from '../src/common.js'
import { FsChar } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (integer->char 97) yields #\\a', () => {
  expect(new FBS().eval('(integer->char 97)')).toStrictEqual(new FsChar('a'))
})

test('evaluating (integer->char 97 97) throws exception', () => {
  expect(() => { new FBS().eval('(integer->char 97 97)') }).toThrow(FsException)
})

test('evaluating (integer->char) throws exception', () => {
  expect(() => { new FBS().eval('(char->integer)') }).toThrow(FsException)
})
