'use strict'

import { FsIf, FsDefine, FsLambda, FsSymbol, FsQuote } from './sexp.js'

import { getGlobalEnv } from './env.js'
import log from 'loglevel'

// Evaluator
export class FsEvaluator {
  static eval (sexp, env = getGlobalEnv()) {
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('----------------------------------------------------')
      log.debug('EVAL:' + sexp + ' in ' + env.toString())
    }
    const ret = FsEvaluator.evalInternal(sexp, env)
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('RETURNS:' + ret)
      log.debug('----------------------------------------------------')
    }
    return ret
  }

  static evalInternal (sexp, env) {
    if (sexp instanceof FsSymbol) {
      return env.find(sexp)
    } else if (!Array.isArray(sexp)) {
      // i.e. FsNumber, FsBoolean...
      return sexp
    } else if (sexp[0].value === 'if') {
      return FsIf.proc(sexp.slice(1), env)
    } else if (sexp[0].value === 'quote') {
      return FsQuote.proc(sexp.slice(1))
    } else if (sexp[0].value === 'define') {
      return FsDefine.proc(sexp.slice(1), env)
    } else if (sexp[0].value === 'lambda') {
      return FsLambda.proc(sexp.slice(1), env)
    } else {
      const evaluated = sexp.map(s => this.eval(s, env))
      return evaluated[0](evaluated.slice(1))
    }
  }
}
