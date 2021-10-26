'use strict'

import log from 'loglevel'

import { FsList, FsString } from './datatypes.js'
import { FsEvaluator as FE } from './evaluator.js'
import { FsExpander } from './expander.js'
import { getGlobalEnv } from './global-env.js'
import { FsParser as FP } from './parser.js'
import { FsopLoad } from './port.js'
import { FsUndefined } from './sexp.js'

// Environment
export class FizzBuzzScheme {
  constructor () {
    this.env = getGlobalEnv()
    this.debugMode = false
    this.expander = new FsExpander(this.env)
    FsopLoad.proc(new FsList([new FsString('src/basic.scm')]), this.env)
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('=======================================================================-')
    }
  }

  eval (code) {
    const orders = FP.parse(code)
    const expanded = this.expander.expand(orders, true)
    log.debug('🤖')
    log.debug('orders.length = ' + orders.length)
    log.debug('expanded.length = ' + expanded.length)
    let ret = null
    for (let i = 0; i < expanded.length; i++) {
      if (expanded[i] === FsUndefined.UNDEFINED) {
        // macro
        return FsUndefined.UNDEFINED
      }
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
