'use strict'

import { FsParser as FP } from '../src/parser.js'
import { FsEvaluator as FE } from '../src/evaluator.js'
import { getGlobalEnv } from '../src/env.js'
import { FsNumber } from '../src/sexp.js'

test('evaluating (define a 1)', () => {
  const code = '(define a 1)'
  const env = getGlobalEnv()
  const ret = (FE.eval(FP.parse(code), env))
  console.dir(ret)
  expect(ret).not.toBeNull()
  expect(ret.value).toBe('a')
  expect(FE.eval(FP.parse('a'), env)).toStrictEqual(new FsNumber(1))
})

test('evaluating (define a (+ 1 2))', () => {
  const code = '(define a (+ 1 2))'
  const env = getGlobalEnv()
  const ret = FE.eval(FP.parse(code), env)
  console.dir(ret)
  expect(ret).not.toBeNull()
  expect(ret.value).toBe('a')
  expect(FE.eval(FP.parse('a'), env)).toStrictEqual(new FsNumber(3))
})

test('evaluating (define b 1) then (+ 1 b)', () => {
  const env = getGlobalEnv()
  FE.eval(FP.parse('(define b 1)'), env)
  expect(FE.eval(FP.parse('(+ 1 b)'), env)).toStrictEqual(new FsNumber(2))
})
