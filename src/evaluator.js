'use strict'

import { FsDefine, FsLambda, FsSymbol, FsQuote, FsSet, FsBegin, FsLet, FsList, FsProcedure } from './sexp.js'
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
    FsEvaluator.evalCounter++
    if (sexp instanceof FsSymbol) {
      return env.find(sexp)
    } else if (!Array.isArray(sexp)) {
      // i.e. FsNumber, FsBoolean...
      return sexp
    } else if (Array.isArray(sexp) && sexp.length === 0) {
      return FsList.EMPTY
    } else if (FsSymbol.IF === sexp[0]) {
      // for the readability, use this line
      // return FsIf.proc(sexp.slice(1), env)

      // for the performance, use lines below. it may be bit faster.
      if (FsEvaluator.eval(sexp[1], env).value) {
        return FsEvaluator.eval(sexp[2], env)
      } else {
        return FsEvaluator.eval(sexp[3], env)
      }
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
      return ret
    } else if (FsSymbol.LAMBDA === sexp[0]) {
      return FsLambda.proc(sexp.slice(1), env)
    } else if (FsSymbol.LET === sexp[0]) {
      return FsLet.proc(sexp.slice(1), env)
    } else {
      // const p = FsEvaluator.eval(sexp[0], env)
      // const args = sexp.slice(1).map(s => this.eval(s, env))
      // return p.proc(args, env) // for testing map

      // for the readability, use this line
      // const args = sexp.slice(1).map(s => this.eval(s, env))

      // for the performance, use lines below. it may be bit faster.
      const args = []
      for (let i = 1; i < sexp.length; i++) {
        args.push(FsEvaluator.eval(sexp[i], env))
      }

      // eslint-disable-next-line no-undef
      const p = FsEvaluator.eval(sexp[0], env)
      if (p instanceof FsProcedure) {
        const innerEnv = new FsEnv(p.env)
        if (p.params instanceof FsSymbol) {
          // ex. ((lambda x x) 3 4 5 6)
          innerEnv.set(p.params, new FsList(args))
          return FsEvaluator.eval(p.params, innerEnv)
        } else {
          // ex. (lambda (x) (+ 1 2))
          for (let i = 0; i < p.params.length; i++) {
            innerEnv.set(p.params[i], args[i])
          }
          return FsEvaluator.eval(p.body, innerEnv)
        }
      } else {
        return p.proc(args, env) // for testing map
      }
    }
  }
}

// } else {
//   const p = FsEvaluator.eval(sexp[0], env)

//   // for the readability, use this line
//   // const args = sexp.slice(1).map(s => this.eval(s, env))

//   // for the performance, use lines below. it may be bit faster.
//   const args = []
//   for (let i = 1; i < sexp.length; i++) {
//     args.push(FsEvaluator.eval(sexp[i], env))
//   }

//   // return p.proc(args)
//   return p.proc(args, env) // for testing map
// }
