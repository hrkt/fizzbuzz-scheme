'use strict'

import { FsBoolean } from '../src/datatypes.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'

// char-upper-case

test('evaluating (char-upper-case? #\\A) yields #t', () => {
  expect(new FBS().eval('(char-upper-case? #\\A)')).toBe(FsBoolean.TRUE)
})

test('evaluating (char-upper-case? #\\a) yields #f', () => {
  expect(new FBS().eval('(char-upper-case? #\\a)')).toBe(FsBoolean.FALSE)
})

// char-lower-case

test('evaluating (char-lower-case? #\\a) yields #t', () => {
  expect(new FBS().eval('(char-lower-case? #\\a)')).toBe(FsBoolean.TRUE)
})

test('evaluating (char-lower-case? #\\A) yields #f', () => {
  expect(new FBS().eval('(char-lower-case? #\\A)')).toBe(FsBoolean.FALSE)
})

// char-whitespace

test('evaluating (char-whitespace? #\\space) yields #t', () => {
  expect(new FBS().eval('(char-whitespace? #\\space)')).toBe(FsBoolean.TRUE)
})

test('evaluating (char-whitespace? #\\a) yields #f', () => {
  expect(new FBS().eval('(char-whitespace? #\\a)')).toBe(FsBoolean.FALSE)
})

// char-alphabetic

test('evaluating (char-alphabetic? #\\space) yields #f', () => {
  expect(new FBS().eval('(char-alphabetic? #\\space)')).toBe(FsBoolean.FALSE)
})

test('evaluating (char-alphabetic? #\\a) yields #t', () => {
  expect(new FBS().eval('(char-alphabetic? #\\a)')).toBe(FsBoolean.TRUE)
})

test('evaluating (char-alphabetic? #\\1) yields #f', () => {
  expect(new FBS().eval('(char-alphabetic? #\\1)')).toBe(FsBoolean.FALSE)
})
