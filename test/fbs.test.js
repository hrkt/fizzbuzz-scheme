'use strict'

import log from 'loglevel'

import { FizzBuzzScheme } from '../src/index.js'

test('enabling debug mode success', () => {
  const fbs = new FizzBuzzScheme()

  const prev = log.getLevel()
  log.setLevel('error')
  fbs.enableDebugMode()
  log.setLevel(prev)
})

test('evalToJs success', () => {
  const fbs = new FizzBuzzScheme()
  expect(fbs.evalToJs('(+ 1 2)')).toBe('3')
})
