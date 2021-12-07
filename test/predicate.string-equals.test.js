'use strict'

import { FsException } from '../src/common.js'
import { FsBoolean } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (string=? "a" "a") yields #t', () => {
  expect(new FBS().eval('(string=? "a" "a")')).toStrictEqual(FsBoolean.TRUE)
})

test('evaluating (string=? "a" "b") yields #t', () => {
  expect(new FBS().eval('(string=? "a" "b")')).toStrictEqual(FsBoolean.FALSE)
})

test('evaluating (string=? "a" "a" "a") yields #t', () => {
  expect(new FBS().eval('(string=? "a" "a" "a")')).toStrictEqual(FsBoolean.TRUE)
})

test('evaluating (string=?) throws excpetion', () => {
  expect(() => { new FBS().eval('(string=?)') }).toThrow(FsException)
})

test('evaluating (string=? "a") throws excpetion', () => {
  expect(() => { new FBS().eval('(string=? "a")') }).toThrow(FsException)
})
