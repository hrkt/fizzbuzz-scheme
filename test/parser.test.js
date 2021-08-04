'use strict'

import { FsParser } from '../src/parser.js'

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
