'use strict'

import { FsParser as FP } from '../src/parser.js'
import { FsEvaluator as FE } from '../src/evaluator.js'

test('evaluating (mod 3 3) yields 0', () => {
  const code = '(mod 3 3)'
  expect(FE.eval(FP.parse(code)).toString()).toBe('0')
})

test('evaluating (mod 3 1) yields 0', () => {
  const code = '(mod 3 1)'
  expect(FE.eval(FP.parse(code)).toString()).toBe('0')
})

test('evaluating (mod 3 2) yields 1', () => {
  const code = '(mod 3 2)'
  expect(FE.eval(FP.parse(code)).toString()).toBe('1')
})
