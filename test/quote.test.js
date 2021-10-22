'use strict'

import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (quote 1) yields 1', () => {
  const code = '(quote 1)'
  expect(new FBS().eval(code).toString()).toBe('1')
})

test('evaluating (quote (+ 1 1)) yields (+ 1 1)', () => {
  const code = '(quote (+ 1 1))'
  expect(new FBS().eval(code).toString()).toBe('(+ 1 1)')
})

test('evaluating \'a yields a', () => {
  const code = '\'a'
  expect(new FBS().eval(code).toString()).toBe('a')
})

test('evaluating \'\'a yields \'a', () => {
  const code = '\'\'a'
  expect(new FBS().eval(code).toString()).toBe('\'a')
})

test('evaluating \'\'\'a yields \'\'a', () => {
  const code = '\'\'\'a'
  expect(new FBS().eval(code).toString()).toBe('\'\'a')
})
