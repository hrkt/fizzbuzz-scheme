'use strict'

import { FsParser as FP } from '../src/parser.js'
import { FsEvaluator as FE } from '../src/evaluator.js'

test('evaluating (if #t 1 2) yields 1', () => {
  const code = '(if #t 1 2)'
  expect(FE.eval(FP.parse(code)).toString()).toBe('1')
})

test('evaluating (if #f 1 2) yields 2', () => {
  const code = '(if #f 1 2)'
  expect(FE.eval(FP.parse(code)).toString()).toBe('2')
})
