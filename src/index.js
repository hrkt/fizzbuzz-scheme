'use strict'

import log from 'loglevel'

import { FsEvaluator as FE } from '../src/evaluator.js'
import { FsParser as FP } from '../src/parser.js'
import { FsAdjuster } from './adjuster.js'
import { FsList, FsString } from './datatypes.js'
import { getGlobalEnv } from './env.js'
import { FspLoad } from './sexp.js'

// Environment
export class FizzBuzzScheme {
  constructor () {
    this.env = getGlobalEnv()
    this.debugMode = false
    FspLoad.proc(new FsList([new FsString('src/basic.scm')]), this.env)
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('=======================================================================-')
    }
  }

  eval (code) {
    const orders = FP.parse(code)
    const adjusted = FsAdjuster.adjust(orders)
    log.debug('🤖')
    log.debug('orders.length = ' + orders.length)
    log.debug('adjusted.length = ' + adjusted.length)
    let ret = null
    for (let i = 0; i < adjusted.length; i++) {
      if (!this.debugMode) {
        ret = FE.eval(adjusted[i], this.env)
      } else {
        ret = FE.evalOuter(adjusted[i], this.env)
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
