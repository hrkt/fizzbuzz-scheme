'use strict'

import { FsParser } from '../src/parser.js'
import { FsString } from '../src/sexp.js'

test('tokenizing (+ 1 2) yields a list of 5 tokens', () => {
  const code = '(+ 1 2)'
  const tokenized = FsParser.tokenize(code)
  expect(tokenized).toHaveLength(5)
})

test('tokenizing (+ 1 2 3) yields a list of 6 tokens', () => {
  const code = '(+ 1 2 3)'
  const tokenized = FsParser.tokenize(code)
  expect(tokenized).toHaveLength(6)
})

test('tokenizing 1 yields a list of 1 token', () => {
  const code = '1'
  const tokenized = FsParser.tokenize(code)
  expect(tokenized).toHaveLength(1)
})

test('tokenizing #t yields a list of 1 token', () => {
  const code = '#t'
  const tokenized = FsParser.tokenize(code)
  expect(tokenized).toHaveLength(1)
})

test('tokenizing "a b" yields a list of 1 token', () => {
  const code = '"a b"'
  const tokenized = FsParser.tokenize(code)
  expect(tokenized).toHaveLength(1)
})

test('parsing "a b" yields a FsString', () => {
  const code = '"a b"'
  const parsed = FsParser.parse(code)
  expect(parsed[0] instanceof FsString).toBe(true)
  expect(parsed).toStrictEqual([new FsString('a b')])
})

test('tokenizing (list "a b") yields a list of 4 token', () => {
  const code = '(list "a b")'
  const tokenized = FsParser.tokenize(code)
  expect(tokenized).toHaveLength(4)
})

test('tokenizing (list "a b")(list "c d") yields 2 lists', () => {
  const code = '(list "a b")(list "c d")'
  const tokenized = FsParser.tokenize(code)
  expect(tokenized).toHaveLength(8)
})
