'use strict'

import { FizzBuzzScheme as FBS } from '../src/index.js'

import log from 'loglevel'

export function enableDebugLog () {
  log.setLevel('debug')
}

export function expse (code, obj) {
  expect(new FBS().eval(code)).toStrictEqual(obj)
}

export function sepByCat () {
  console.dir('🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈🐈')
}
