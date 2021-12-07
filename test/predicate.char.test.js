'use strict'

import { FsException } from '../src/common.js'
import { FsBoolean } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (char? #\\a) yields #t', () => {
  expect(new FBS().eval('(char? #\\a)')).toStrictEqual(FsBoolean.TRUE)
})

test('evaluating (char? 1) yields #f', () => {
  expect(new FBS().eval('(char? 1)')).toStrictEqual(FsBoolean.FALSE)
})

test('evaluating (char?) throws exception', () => {
  expect(() => { new FBS().eval('(char?)') }).toThrow(FsException)
})

test('evaluating (char? #\\a #\\b) throws exception', () => {
  expect(() => { new FBS().eval('(char? #\\a #\\b)') }).toThrow(FsException)
})

//

test('evaluating (char=? #\\a #\\a) yields #t', () => {
  expect(new FBS().eval('(char=? #\\a #\\a)')).toStrictEqual(FsBoolean.TRUE)
})

test('evaluating (char=? #\\a #\\b) yields #t', () => {
  expect(new FBS().eval('(char=? #\\a #\\b)')).toStrictEqual(FsBoolean.FALSE)
})

test('evaluating (char=? #\\a #\\a #\\a) yields #t', () => {
  expect(new FBS().eval('(char=? #\\a #\\a #\\a)')).toStrictEqual(FsBoolean.TRUE)
})

//

test('evaluating (char<? #\\b #\\a) yields #f', () => {
  expect(new FBS().eval('(char<? #\\b #\\a)')).toStrictEqual(FsBoolean.FALSE)
})

test('evaluating (char<? #\\a #\\a) yields #f', () => {
  expect(new FBS().eval('(char<? #\\a #\\a)')).toStrictEqual(FsBoolean.FALSE)
})

test('evaluating (char<? #\\a #\\b) yields #t', () => {
  expect(new FBS().eval('(char<? #\\a #\\b)')).toStrictEqual(FsBoolean.TRUE)
})

test('evaluating (char<? #\\a #\\b #\\c) yields #t', () => {
  expect(new FBS().eval('(char<? #\\a #\\b #\\c)')).toStrictEqual(FsBoolean.TRUE)
})

//

test('evaluating (char>? #\\b #\\a) yields #f', () => {
  expect(new FBS().eval('(char>? #\\a #\\b)')).toStrictEqual(FsBoolean.FALSE)
})

test('evaluating (char>? #\\a #\\a) yields #f', () => {
  expect(new FBS().eval('(char>? #\\a #\\a)')).toStrictEqual(FsBoolean.FALSE)
})

test('evaluating (char>? #\\a #\\b) yields #f', () => {
  expect(new FBS().eval('(char>? #\\a #\\a)')).toStrictEqual(FsBoolean.FALSE)
})

test('evaluating (char>? #\\c #\\b #\\a) yields #t', () => {
  expect(new FBS().eval('(char>? #\\c #\\b #\\a)')).toStrictEqual(FsBoolean.TRUE)
})
