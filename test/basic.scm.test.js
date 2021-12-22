'use strict'

import { FsException } from '../src/common.js'
import { FsBoolean, FsChar } from '../src/datatypes.js'
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

// char-upcase

test('evaluating (char-upcase #\\a) yields #\\A', () => {
  expect(new FBS().eval('(char-upcase #\\a)')).toStrictEqual(new FsChar('A'))
})

test('evaluating (char-upcase? #\\A) yields #\\A', () => {
  expect(new FBS().eval('(char-upcase #\\A)')).toStrictEqual(new FsChar('A'))
})

// char-downcase

test('evaluating (char-downcase #\\a) yields #\\a', () => {
  expect(new FBS().eval('(char-upcase #\\a)')).toStrictEqual(new FsChar('a'))
})

test('evaluating (char-downcase #\\A) yields #\\a', () => {
  expect(new FBS().eval('(char-upcase #\\A)')).toStrictEqual(new FsChar('a'))
})

// char-ci=?

test('evaluating (char-ci=? #\\a #\\A) yields #t', () => {
  expect(new FBS().eval('(char-ci=? #\\a #\\A)')).toBe(FsBoolean.TRUE)
})

test('evaluating (char-ci=? #\\a #\\a) yields #f', () => {
  expect(new FBS().eval('(char-ci=? #\\a #\\a)')).toBe(FsBoolean.TRUE)
})

test('evaluating (char-ci=? #\\a #\\b) yields #f', () => {
  expect(new FBS().eval('(char-ci=? #\\a #\\b)')).toBe(FsBoolean.FALSE)
})

// char-ci*

test('evaluating (char-ci<? #\\a #\\B) yields #t', () => {
  expect(new FBS().eval('(char-ci<? #\\a #\\B)')).toBe(FsBoolean.TRUE)
})

test('evaluating (char-ci<=? #\\a #\\A) yields #t', () => {
  expect(new FBS().eval('(char-ci<=? #\\a #\\A)')).toBe(FsBoolean.TRUE)
})

test('evaluating (char-ci>? #\\B #\\a) yields #t', () => {
  expect(new FBS().eval('(char-ci>? #\\B #\\a)')).toBe(FsBoolean.TRUE)
})

test('evaluating (char-ci>=? #\\A #\\a) yields #t', () => {
  expect(new FBS().eval('(char-ci>=? #\\A #\\a)')).toBe(FsBoolean.TRUE)
})

// scheme-report-environment version)
test('evaluating (scheme-report-environment 5) do not throw an error', () => {
  expect(new FBS().eval('(scheme-report-environment 5)')).not.toBeNull()
})

test('evaluating (scheme-report-environment 7) throws an exception', () => {
  expect(() => { new FBS().eval('(scheme-report-environment 7)') }).toThrow(FsException)
})

// (null-environment version)
test('evaluating (null-environment 5) do not throw an error', () => {
  expect(new FBS().eval('(null-environment 5)')).not.toBeNull()
})

test('evaluating (null-environment 7) throws an exception', () => {
  expect(() => { new FBS().eval('(null-environment 7)') }).toThrow(FsException)
})
