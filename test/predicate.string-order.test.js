'use strict'

import { FsException } from '../src/common.js'
import { FsBoolean } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

// string<?

test('evaluating (string<?) throws exception', () => {
  expect(() => { new FBS().eval('(string<? "ab")') }).toThrow(FsException)
})

test('evaluating (string<? "a") throws exception', () => {
  expect(() => { new FBS().eval('(string<? "ab")') }).toThrow(FsException)
})

test('evaluating (string<? "ab" "ab") yields #f', () => {
  expect(new FBS().eval('(string<? "ab" "ab")')).toStrictEqual(FsBoolean.FALSE)
})

test('evaluating (string<? "ab" "ac") yields #t', () => {
  expect(new FBS().eval('(string<? "ab" "ac")')).toStrictEqual(FsBoolean.TRUE)
})

test('evaluating (string<? "ab" "abc") yields #t', () => {
  expect(new FBS().eval('(string<? "ab" "abc")')).toStrictEqual(FsBoolean.TRUE)
})

test('evaluating (string<? "abc" "ac") yields #f', () => {
  expect(new FBS().eval('(string<? "abc" "ac")')).toStrictEqual(FsBoolean.TRUE)
})

// string<=?

test('evaluating (string<=? "ab" "ab") yields #t', () => {
  expect(new FBS().eval('(string<=? "ab" "ab")')).toStrictEqual(FsBoolean.TRUE)
})

test('evaluating (string<=? "ab" "ac") yields #t', () => {
  expect(new FBS().eval('(string<=? "ab" "ac")')).toStrictEqual(FsBoolean.TRUE)
})

test('evaluating (string<=? "ab" "abc") yields #t', () => {
  expect(new FBS().eval('(string<=? "ab" "abc")')).toStrictEqual(FsBoolean.TRUE)
})

test('evaluating (string<=? "abc" "ac") yields #f', () => {
  expect(new FBS().eval('(string<=? "abc" "ac")')).toStrictEqual(FsBoolean.TRUE)
})

// string>?

test('evaluating (string>? "ab" "ab") yields #f', () => {
  expect(new FBS().eval('(string>? "ab" "ab")')).toStrictEqual(FsBoolean.FALSE)
})

test('evaluating (string>? "ab" "ac") yields #t', () => {
  expect(new FBS().eval('(string>? "ab" "ac")')).toStrictEqual(FsBoolean.FALSE)
})

test('evaluating (string>? "ab" "abc") yields #f', () => {
  expect(new FBS().eval('(string>? "ab" "abc")')).toStrictEqual(FsBoolean.FALSE)
})

test('evaluating (string>? "abc" "ac") yields #f', () => {
  expect(new FBS().eval('(string>? "abc" "ac")')).toStrictEqual(FsBoolean.FALSE)
})

test('evaluating (string>? "abc" "ab") yields #t', () => {
  expect(new FBS().eval('(string>? "abc" "ab")')).toStrictEqual(FsBoolean.TRUE)
})

test('evaluating (string>? "ac" "abc") yields #t', () => {
  expect(new FBS().eval('(string>? "ac" "abc")')).toStrictEqual(FsBoolean.TRUE)
})

// string=>?

test('evaluating (string>=? "ab" "ab") yields #t', () => {
  expect(new FBS().eval('(string>=? "ab" "ab")')).toStrictEqual(FsBoolean.TRUE)
})

test('evaluating (string>=? "ab" "ac") yields #f', () => {
  expect(new FBS().eval('(string>=? "ab" "ac")')).toStrictEqual(FsBoolean.FALSE)
})

test('evaluating (string>=? "ab" "abc") yields #f', () => {
  expect(new FBS().eval('(string>=? "ab" "abc")')).toStrictEqual(FsBoolean.FALSE)
})

test('evaluating (string>=? "abc" "ac") yields #f', () => {
  expect(new FBS().eval('(string>=? "abc" "ac")')).toStrictEqual(FsBoolean.FALSE)
})

test('evaluating (string>=? "abc" "ab") yields #t', () => {
  expect(new FBS().eval('(string>=? "abc" "ab")')).toStrictEqual(FsBoolean.TRUE)
})

test('evaluating (string>=? "ac" "abc") yields #t', () => {
  expect(new FBS().eval('(string>=? "ac" "abc")')).toStrictEqual(FsBoolean.TRUE)
})
