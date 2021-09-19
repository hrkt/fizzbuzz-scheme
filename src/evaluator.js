'use strict'

import { FsDefine, FsLambda, FsSymbol, FsSet, FsLet, FsList, FsProcedureSetCdr } from './sexp.js'
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

  // static eval (sexp, env = getGlobalEnv()) {
  static eval (sexp, env = getGlobalEnv()) {
    while (true) {
      // FsEvaluator.evalCounter++
      // do not use sexp.instanceof XXXX because it's slower than simple field comparison
      if (sexp.type === 'fssymbol') {
        return env.find(sexp)
      } else if (sexp.type !== 'fslist') {
      // i.e. FsNumber, FsBoolean...
        return sexp
      // } else if (sexp === FsList.EMPTY) {
        // after this case, "sexp" is a instance of FsList
      } else if (sexp.length === 0) {
        return FsList.EMPTY
      } else { // list-case
        const firstSymbol = sexp.at(0)
        if (FsSymbol.IF === firstSymbol) {
          FsEvaluator.eval(sexp.at(1), env).value ? sexp = sexp.at(2) : sexp = sexp.at(3)
        } else if (FsSymbol.QUOTE === firstSymbol || FsSymbol.SINGLE_QUOTE === firstSymbol) {
          return sexp.at(1)
        } else if (FsSymbol.DEFINE === firstSymbol) {
          return FsDefine.proc(sexp.slice(1), env)
        } else if (FsSymbol.SET_ === firstSymbol) {
          return FsSet.proc(sexp.slice(1), env)
        } else if (FsSymbol.SET_CDR_ === firstSymbol) {
          return FsProcedureSetCdr.proc(sexp.slice(1), env)
        } else if (FsSymbol.BEGIN === firstSymbol) {
          let ret = null
          for (let i = 1; i < sexp.length; i++) {
            ret = FsEvaluator.eval(sexp.at(i), env)
          }
          sexp = ret
        } else if (FsSymbol.LAMBDA === firstSymbol) {
          return FsLambda.proc(sexp.slice(1), env)
        } else if (FsSymbol.LET === firstSymbol) {
          return FsLet.proc(sexp.slice(1), env)
        } else {
        // for the readability, use this line
        // const args = sexp.slice(1).map(s => this.eval(s, env))

          // for the performance, use lines below. it may be bit faster.
          // const evaled = []
          // for (let i = 0; i < sexp.length; i++) {
          //   evaled.push(FsEvaluator.eval(sexp[i], env))
          // }

          const p = FsEvaluator.eval(firstSymbol, env)
          if (p.type === 'fsdefinedprocedure') {
            const innerEnv = new FsEnv(p.env)
            if (p.params.type === 'fssymbol') {
              // ex. ((lambda x x) 3 4 5 6)
              const evaled = []
              for (let i = 1; i < sexp.length; i++) {
                evaled.push(FsEvaluator.eval(sexp.at(i), env))
              }
              innerEnv.set(p.params, new FsList(evaled))
              sexp = p.params
              env = innerEnv
            } else {
              // ex. (lambda (x) (+ 1 2))
              for (let i = 0; i < p.params.length; i++) {
                innerEnv.set(p.params.at(i), FsEvaluator.eval(sexp.at(i + 1), env))
              }
              sexp = p.body
              env = innerEnv
            }
          } else {
          // evaled.length = sexp.length - 1 // this line slows execution, so we do not do this.
            const evaled = new FsList()
            for (let i = 1; i < sexp.length; i++) {
              evaled.set(i - 1, FsEvaluator.eval(sexp.at(i), env))
            }
            return p(evaled, env) // for testing map
          }
        } // user-defined-proc or pre-defined proc
      } // list-case
    }
  }
}
