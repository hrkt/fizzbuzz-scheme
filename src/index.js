'use strict'

import log from 'loglevel'

import { FsList, FsString } from './datatypes.js'
import { getGlobalEnv } from './env.js'
import { FsEvaluator as FE } from './evaluator.js'
import { FsExpander } from './expander.js'
import { FsParser as FP } from './parser.js'
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
    const expanded = FsExpander.expand(orders)
    log.debug('🤖')
    log.debug('orders.length = ' + orders.length)
    log.debug('expanded.length = ' + expanded.length)
    let ret = null
    for (let i = 0; i < expanded.length; i++) {
      if (!this.debugMode) {
        ret = FE.eval(expanded[i], this.env)
      } else {
        ret = FE.evalOuter(expanded[i], this.env)
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
