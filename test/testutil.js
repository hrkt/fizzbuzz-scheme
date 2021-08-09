'use strict'

import { FizzBuzzScheme as FBS } from '../src/index.js'

import log from 'loglevel'

export function enableDebugLog () {
  log.setLevel('debug')
}

export function codeEvaledTo (code, obj, fbs = new FBS()) {
  expect(fbs.eval(code)).toStrictEqual(obj)
}

export function sepByCat () {
  console.dir('🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈')
}
