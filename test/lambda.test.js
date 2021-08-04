'use strict'

import { FsParser as FP } from '../src/parser.js'
import { FsEvaluator as FE } from '../src/evaluator.js'
import { getGlobalEnv } from '../src/env.js'
import { FsNumber } from '../src/sexp.js'
import log from 'loglevel'
log.setLevel('debug')

test('evaluating (define p (lambda (x) (+ x x)))', () => {
  const code = '(define p (lambda (x) (+ x x)))'
  const env = getGlobalEnv()
  const ret = (FE.eval(FP.parse(code), env))
  console.dir(ret)
  expect(ret).not.toBeNull()
})

test('evaluating (define p (lambda (x) (+ x x))), then (p 1)', () => {
  const code = '(define p (lambda (x) (+ x x)))'
  const env = getGlobalEnv()
  const ret1 = (FE.eval(FP.parse(code), env))
  console.dir(ret1)
  expect(ret1).not.toBeNull()
  const ret2 = (FE.eval(FP.parse('(p 1)'), env))
  expect(ret2).not.toBeNull()
  expect(ret2).toStrictEqual(new FsNumber(2))
})

