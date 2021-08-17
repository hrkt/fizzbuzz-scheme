'use strict'

import { FsIf, FsDefine, FsLambda, FsSymbol, FsQuote, FsSet, FsBegin, FsValue, FsSingleQuoteSymbol } from './sexp.js'
import { getGlobalEnv } from './env.js'

import log from 'loglevel'

// Evaluator
export class FsEvaluator {
  // if you want to dump environment for debugging purpose, comment out these and change
  // existing evalInternal() to eval()
  //
  static eval (sexp, env = getGlobalEnv()) {
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('----------------------------------------------------')
      log.debug('EVAL:' + sexp + ' in ' + env.toString())
      log.debug(JSON.stringify(sexp))
    }
    const ret = FsEvaluator.evalInternal(sexp, env)
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('RETURNS:' + ret.toString() + ' for sexp:' + sexp)
      log.debug('----------------------------------------------------')
    }
    return ret
  }

  // static eval (sexp, env = getGlobalEnv()) { // if you want to remove codes for the speed purpose.
  static evalInternal (sexp, env) { // for debugging purpose, use this line
    if (sexp instanceof FsSymbol) {
      return env.find(sexp)
    } else if (!Array.isArray(sexp)) {
      // i.e. FsNumber, FsBoolean...
      return sexp
    } else if (sexp instanceof FsValue) {
      return sexp.evaled()
    } else if (sexp[0].value === 'if') {
      return FsIf.proc(sexp.slice(1), env)
    } else if (sexp[0].value === 'quote') {
      return FsQuote.proc(sexp.slice(1))
    } else if (sexp[0] instanceof FsSingleQuoteSymbol) {
      return FsQuote.proc(sexp.slice(1))
    } else if (sexp[0].value === 'define') {
      return FsDefine.proc(sexp.slice(1), env)
    } else if (sexp[0].value === 'set!') {
      return FsSet.proc(sexp.slice(1), env)
    } else if (sexp[0].value === 'begin') {
      return FsBegin.proc(sexp.slice(1), env)
    } else if (sexp[0].value === 'lambda') {
      return FsLambda.proc(sexp.slice(1), env)
    } else {
      const p = FsEvaluator.eval(sexp[0], env)
      const args = sexp.slice(1).map(s => this.eval(s, env))
      return p.proc(args)
    }
  }
}
