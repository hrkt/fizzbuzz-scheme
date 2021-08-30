'use strict'

import { FsParser as FP } from '../src/parser.js'
import { FsEvaluator as FE } from '../src/evaluator.js'

import log from 'loglevel'
import { getGlobalEnv } from './env.js'

// Environment
export class FizzBuzzScheme {
  constructor () {
    this.env = getGlobalEnv()
    this.debugMode = false
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('=======================================================================-')
    }
  }

  eval (code) {
    const orders = FP.parse(code)
    log.debug('🤖')
    log.debug('orders.length = ' + orders.length)
    let ret = null
    for (let i = 0; i < orders.length; i++) {
      if (!this.debugMode) {
        ret = FE.eval(orders[i], this.env)
      } else {
        ret = FE.evalOuter(orders[i], this.env)
      }
    }
    return ret
  }

  evalToJs (code) {
    return this.eval(code, this.env).toString()
  }

  enableDebugMode () {
    log.setLevel('trace')
  }
}
