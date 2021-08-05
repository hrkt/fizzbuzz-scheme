'use strict'

import { FsParser as FP } from '../src/parser.js'
import { FsEvaluator as FE } from '../src/evaluator.js'
import { getGlobalEnv } from '../src/env.js'
import log from 'loglevel'
log.setLevel('debug')

test('evaluating area', () => {
  const code = '(define area (lambda (r) (* 3.141592653 (* r r))))'
  const env = getGlobalEnv()
  FE.eval(FP.parse(code), env)
  const ret = FE.eval(FP.parse('(area 3)'), env)
  console.dir(ret)
  expect(ret.toString()).toBe('28.274333877')
})

test('evaluating fact', () => {
  const code = ' (define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))'
  const env = getGlobalEnv()
  FE.eval(FP.parse(code), env)
  const ret = FE.eval(FP.parse('(fact 10)'), env)
  console.dir(ret)
  expect(ret.toString()).toBe('3628800')
})
