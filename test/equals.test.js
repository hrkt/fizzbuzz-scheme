'use strict'

import { FsParser as FP } from '../src/parser.js'
import { FsEvaluator as FE } from '../src/evaluator.js'

test('evaluating (= 1 1) yields true', () => {
  const code = '(= 1 1)'
  expect(FE.eval(FP.parse(code)).toString()).toBe('#t')
})

test('evaluating (= 1 2) yields false', () => {
  const code = '(= 1 2)'
  expect(FE.eval(FP.parse(code)).toString()).toBe('#f')
})
