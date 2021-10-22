'use strict'

import { FizzBuzzScheme } from '../src/index.js'

test('evaluating (quote 1) yields 1', () => {
  const code = '(quote 1)'
  const fbs = new FizzBuzzScheme()
  expect(fbs.eval(code).toString()).toBe('1')
})

test('evaluating (quote (+ 1 1)) yields (+ 1 1)', () => {
  const code = '(quote (+ 1 1))'
  const fbs = new FizzBuzzScheme()
  expect(fbs.eval(code).toString()).toBe('(+ 1 1)')
})

test('evaluating \'a yields a', () => {
  const code = '\'a'
  const fbs = new FizzBuzzScheme()
  expect(fbs.eval(code).toString()).toBe('a')
})

test('evaluating \'\'a yields \'a', () => {
  const code = '\'\'a'
  const fbs = new FizzBuzzScheme()
  expect(fbs.eval(code).toString()).toBe('\'a')
})

test('evaluating \'\'\'a yields \'\'a', () => {
  const code = '\'\'\'a'
  const fbs = new FizzBuzzScheme()
  expect(fbs.eval(code).toString()).toBe('\'\'a')
})
