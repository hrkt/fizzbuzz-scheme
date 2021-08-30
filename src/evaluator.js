'use strict'

import { FsIf, FsDefine, FsLambda, FsSymbol, FsQuote, FsSet, FsBegin, FsLet, FsList } from './sexp.js'
import { getGlobalEnv } from './env.js'

import log from 'loglevel'

// Evaluator
export class FsEvaluator {
  static evalOuter (sexp, env = getGlobalEnv()) {
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('----------------------------------------------------')
      log.debug('EVAL:' + sexp + ' in ' + env.toString())
      log.debug(JSON.stringify(sexp))
    }
    const ret = FsEvaluator.eval(sexp, env)
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('RETURNS:' + ret.toString() + ' for sexp:' + sexp)
      log.debug('----------------------------------------------------')
    }
    return ret
  }

  static eval (sexp, env = getGlobalEnv()) {
    if (sexp instanceof FsSymbol) {
      return env.find(sexp)
    } else if (!Array.isArray(sexp)) {
      // i.e. FsNumber, FsBoolean...
      return sexp
    } else if (Array.isArray(sexp) && sexp.length === 0) {
      return FsList.EMPTY
    } else if (FsSymbol.IF === sexp[0]) {
      return FsIf.proc(sexp.slice(1), env)
    } else if (FsSymbol.QUOTE === sexp[0]) {
      return FsQuote.proc(sexp.slice(1))
    } else if (FsSymbol.SINGLE_QUOTE === sexp[0]) {
      return FsQuote.proc(sexp.slice(1))
    } else if (FsSymbol.DEFINE === sexp[0]) {
      return FsDefine.proc(sexp.slice(1), env)
    } else if (FsSymbol.SET_ === sexp[0]) {
      return FsSet.proc(sexp.slice(1), env)
    } else if (FsSymbol.BEGIN === sexp[0]) {
      return FsBegin.proc(sexp.slice(1), env)
    } else if (FsSymbol.LAMBDA === sexp[0]) {
      return FsLambda.proc(sexp.slice(1), env)
    } else if (FsSymbol.LET === sexp[0]) {
      return FsLet.proc(sexp.slice(1), env)
    } else {
      const p = FsEvaluator.eval(sexp[0], env)
      const args = sexp.slice(1).map(s => this.eval(s, env))
      // return p.proc(args)
      return p.proc(args, env) // for testing map
    }
  }
}
