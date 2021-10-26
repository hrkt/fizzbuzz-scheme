'use strict'

import { FsError } from '../src/common.js'
import { FsNumber } from '../src/datatypes.js'
import { FsEnv } from '../src/env'
import { getGlobalEnv } from '../src/global-env.js'
import { FsSymbol } from '../src/symbol'

test('define env success', () => {
  const env = new FsEnv(null)
  // expect(env.vars).toStrictEqual(new Map()) // we use old-fashioned {}, for battle against fibonacchi bench
  expect(env.vars).toStrictEqual(Object.create(null))
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
  expect(env.find(new FsSymbol('+'))).not.toBeNull()
})

// test('define env multiple times and get increased id success', () => {
//   const env1 = new FsEnv(null)
//   env1.set(new FsSymbol('A'), new FsNumber(1))
//   expect(env1.find(new FsSymbol('A'))).toStrictEqual(new FsNumber(1))

//   const env2 = new FsEnv(env1)
//   env2.set(new FsSymbol('A'), new FsNumber(2))
//   expect(env1.find(new FsSymbol('A'))).toStrictEqual(new FsNumber(1))
//   expect(env2.find(new FsSymbol('A'))).toStrictEqual(new FsNumber(2))

//   const env3 = new FsEnv(env2)
//   env3.set(new FsSymbol('A'), new FsNumber(3))
//   expect(env1.find(new FsSymbol('A'))).toStrictEqual(new FsNumber(1))
//   expect(env2.find(new FsSymbol('A'))).toStrictEqual(new FsNumber(2))
//   expect(env3.find(new FsSymbol('A'))).toStrictEqual(new FsNumber(3))

//   expect(env1.id === env2.id).not.toBe(true)
//   expect(env1.id === env3.id).not.toBe(true)
//   expect(env2.id === env3.id).not.toBe(true)
// })

test('calling toKey with null parameter throws FsError ', () => {
  expect(() => { FsEnv.toKey(null) }).toThrow(FsError)
})

test('do not exceed maximum call stack size', () => {
  const environments = []
  environments[0] = getGlobalEnv()
  const max = 10000
  for (let i = 1; i < max; i++) {
    // counter += Array.isArray([]) ? 1 : 0
    environments[i] = new FsEnv(environments[i - 1])
  }
  expect(environments[max - 1].find(new FsSymbol('+'))).not.toBeNull()
})
