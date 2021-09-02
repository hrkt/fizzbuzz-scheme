'use strict'

import { FsDefine, FsLambda, FsSymbol, FsQuote, FsSet, FsLet, FsList, FsProcedure } from './sexp.js'
import { FsEnv, getGlobalEnv } from './env.js'

import log from 'loglevel'

// Evaluator
export class FsEvaluator {
  static evalCounter = 0
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
    while (true) {
      FsEvaluator.evalCounter++
      if (sexp instanceof FsSymbol) {
        return env.find(sexp)
      } else if (!Array.isArray(sexp)) {
      // i.e. FsNumber, FsBoolean...
        return sexp
      } else if (Array.isArray(sexp) && sexp.length === 0) {
        return FsList.EMPTY
      } else if (FsSymbol.IF === sexp[0]) {
        sexp = FsEvaluator.eval(sexp[1], env).value ? sexp[2] : sexp[3]
      } else if (FsSymbol.QUOTE === sexp[0]) {
        return FsQuote.proc(sexp.slice(1))
      } else if (FsSymbol.SINGLE_QUOTE === sexp[0]) {
        return FsQuote.proc(sexp.slice(1))
      } else if (FsSymbol.DEFINE === sexp[0]) {
        return FsDefine.proc(sexp.slice(1), env)
      } else if (FsSymbol.SET_ === sexp[0]) {
        return FsSet.proc(sexp.slice(1), env)
      } else if (FsSymbol.BEGIN === sexp[0]) {
        let ret = null
        for (let i = 1; i < sexp.length; i++) {
          ret = FsEvaluator.eval(sexp[i], env)
        }
        sexp = ret
      } else if (FsSymbol.LAMBDA === sexp[0]) {
        return FsLambda.proc(sexp.slice(1), env)
      } else if (FsSymbol.LET === sexp[0]) {
        return FsLet.proc(sexp.slice(1), env)
      } else {
        // for the readability, use this line
        // const args = sexp.slice(1).map(s => this.eval(s, env))

        // for the performance, use lines below. it may be bit faster.
        const evaled = []
        for (let i = 0; i < sexp.length; i++) {
          evaled.push(FsEvaluator.eval(sexp[i], env))
        }

        const p = evaled.shift()
        if (p instanceof FsProcedure) {
          const innerEnv = new FsEnv(p.env)
          if (p.params instanceof FsSymbol) {
          // ex. ((lambda x x) 3 4 5 6)
            innerEnv.set(p.params, new FsList(evaled))
            sexp = p.params
            env = innerEnv
          } else {
          // ex. (lambda (x) (+ 1 2))
            for (let i = 0; i < p.params.length; i++) {
              innerEnv.set(p.params[i], evaled[i])
            }
            sexp = p.body
            env = innerEnv
          }
        } else {
          return p.proc(evaled, env) // for testing map
        }
      }
    }
  }
}
