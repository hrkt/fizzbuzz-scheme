'use strict'

import log from 'loglevel'

import { FsException } from '../src/common.js'
import { FizzBuzzScheme as FBS } from '../src/index.js'
import { FsUndefined } from '../src/sexp.js'

test('evaluating (fs-set-loglevel success', () => {
  const prev = log.getLevel()
  const logLevels = ['trace', 'debug', 'info', 'warn', 'error']
  logLevels.forEach(l => {
    expect(new FBS().eval('(fs-set-loglevel "' + l + '")')).toStrictEqual(FsUndefined.UNDEFINED)
  })
  log.setLevel(prev)
})

test('evaluating (fs-set-loglevel with no arg throws exception', () => {
  expect(() => { new FBS().eval('(fs-set-loglevel)') }).toThrow(FsException)
})
