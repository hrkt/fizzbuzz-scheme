'use strict'

// eslint-disable-next-line no-unused-vars
import { FizzBuzzScheme as FBS } from '../src/index.js'

test('evaluating (call-with-values (lambda () (cons 1 2)) display) yields (1 . 2)#undefined', () => {
  const code = '(call-with-values (lambda () (cons 1 2)) display)'
  expect(new FBS().eval(code)).toBe('(1 . 2)#undefined')
})
