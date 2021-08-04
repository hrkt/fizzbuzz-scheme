'use strict'

import { FsNumber, FsSymbol } from '../src/sexp.js'
import { FsEnv, getGlobalEnv } from '../src/env'

test('define env success', () => {
  const env = new FsEnv(null)
  expect(env.vars).toStrictEqual(new Map())
})

test('get a symbol from the env success', () => {
  const env = new FsEnv(null)
  env.set(new FsSymbol('A'), new FsNumber(1))
  expect(env.find(new FsSymbol('A'))).toStrictEqual(new FsNumber(1))
})

test('define env success with outer env success', () => {
  const outerEnv = new FsEnv(null)
  outerEnv.set(new FsSymbol('A'), new FsNumber(1))
  const env = new FsEnv(outerEnv)
  expect(env.find(new FsSymbol('A'))).toStrictEqual(new FsNumber(1))
})

test('getDefaultEnv success', () => {
  // eslint-disable-next-line no-unused-vars
  const env = getGlobalEnv()
  console.dir(env)
  expect(env.find(new FsSymbol('+'))).not.toBeNull()
})
