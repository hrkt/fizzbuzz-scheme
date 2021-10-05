'use strict'

import { FsDefine, FsLambda, FsSet, FsLet, FsProcedureSetCdr } from './sexp.js'
import { FsEnv, getGlobalEnv } from './env.js'

import log from 'loglevel'
import { FsException } from './common.js'
import { FsList } from './datatypes.js'
import { FsSymbol } from './symbol.js'

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
              // e.g. ((lambda x x) 3 4 5 6)
              // eval args, store them, bind them as given param symbol.
              // then eval its body in the next loop.
              const evaled = []
              // given params are in sexp.slice(1)
              for (let i = 1; i < sexp.length; i++) {
                evaled.push(FsEvaluator.eval(sexp.at(i), env))
              }
              innerEnv.set(p.params, new FsList(evaled))
              sexp = p.body.at(0) // TODO: multiplue bodies
              env = innerEnv
            } else {
              const givenParams = sexp.slice(1)
              // ex. (lambda (x) (+ 1 2))
              // fixed number "n" case or take "n or more" case
              if (p.params.type === 'fspair') {
                const paramAsList = []
                const currentPair = p.params
                let nextPair = currentPair.cdr
                paramAsList.push(currentPair.car)
                let hasNext = true
                while (hasNext) {
                  if (nextPair.cdr !== undefined && nextPair.cdr.type !== 'fspair') {
                    paramAsList.push(nextPair.car)
                    paramAsList.push(nextPair.cdr)
                    hasNext = false
                  } else {
                    paramAsList.push(currentPair.car)
                    nextPair = currentPair.cdr
                  }
                }
                if (givenParams.length < paramAsList.length) {
                  throw new FsException('this function requires at least ' + (paramAsList.length - 1) + ' argument(s)')
                } else { // givenParams.length >== paramAsList.length - 1
                  for (let i = 0; i < paramAsList.length - 1; i++) {
                    innerEnv.set(paramAsList[i], FsEvaluator.eval(givenParams.at(i), env))
                  }
                  const rest = givenParams.slice(paramAsList.length - 1)
                  // innerEnv.set(paramAsList[paramAsList.length - 1], FsEvaluator.eval(rest, env))
                  const restEvaled = rest.value.map(s => FsEvaluator.eval(s, env))
                  innerEnv.set(paramAsList[paramAsList.length - 1], new FsList(restEvaled))
                }
                sexp = p.body.at(0) // TODO: multiplue bodies
                env = innerEnv
              } else if (p.params.type === 'fslist') {
                for (let i = 0; i < p.params.length; i++) {
                  innerEnv.set(p.params.at(i), FsEvaluator.eval(givenParams.at(i), env))
                }
                sexp = p.body.at(0) // TODO: multiplue bodies
                env = innerEnv
              } else {
                throw new Error('not implemented')
              }
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
