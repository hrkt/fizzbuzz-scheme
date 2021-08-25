'use strict'

import { FizzBuzzScheme } from '../src/index.js'

test('enabling debug mode success', () => {
  const fbs = new FizzBuzzScheme()
  fbs.enableDebugMode()
})

test('evalToJs success', () => {
  const fbs = new FizzBuzzScheme()
  expect(fbs.evalToJs('(+ 1 2)')).toBe(3)
})
