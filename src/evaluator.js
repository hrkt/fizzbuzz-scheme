'use strict'

import log from 'loglevel'

import { FsException } from './common.js'
import { FsList, isProperList } from './datatypes.js'
import { FsEnv } from './env.js'
import { FslpMap, FslsCond, FslsDelay, FslsDo, FslsLet, FslsLetAsterisk, FslsLetRecAsterisk, FslsOr, FspCallCc, FspCallWithValues, FspDynamicWind, FspSetCdr, FssDefine, FssLambda, FssQuasiQuote, FssSet, FsUndefined } from './sexp.js'
import { FsSymbol } from './symbol.js'
// Refactored code here
// Evaluator
export class FsEvaluator {
  static evalCounter = 0
  // This is the JavaScript function to call when the current Scheme
  // expression produces a value. It represents the part of the Scheme
  // program that is still waiting for that value.
  static currentContinuation = null
  // When this is set, the current evaluation is inside dynamic-wind. A
  // saved continuation must run this function before it re-enters the wind.
  static currentWindBefore = null

  static evalWithContinuation (sexp, env, continuation) {
    // Evaluation is nested in many places in the old evaluator. Save the
    // previous callback so an inner evaluation does not destroy the callback
    // belonging to its caller.
    const previousContinuation = FsEvaluator.currentContinuation
    FsEvaluator.currentContinuation = continuation
    try {
      return FsEvaluator.eval(sexp, env)
    } finally {
      FsEvaluator.currentContinuation = previousContinuation
    }
  }

  static captureContinuation (escape) {
    // A call/cc outside dynamic-wind still needs an escape continuation. When
    // dynamic-wind is active, currentContinuation includes the work that must
    // happen after the captured call returns, so that is the continuation to
    // preserve instead.
    return FsEvaluator.currentWindBefore
      ? FsEvaluator.currentContinuation
      : escape
  }

  static evalOuter (sexp, env) {
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
  static eval (sexp, env) {
    while (true) {
      // FsEvaluator.evalCounter++
      // do not use sexp.instanceof XXXX because it's slower than simple field comparison
      if (sexp.type === 'fssymbol') {
        return env.find(sexp)
      } else if (sexp.type !== 'fslist') {
        // i.e. FsNumber, FsBoolean...
        return sexp
        // after this case, "sexp" is a instance of FsList
      } else if (sexp.length === 0) {
        return FsList.EMPTY
      } else { // list-case
        const firstSymbol = sexp.at(0)

        if (FsSymbol.IF === firstSymbol) {
          const condition = FsEvaluator.eval(sexp.at(1), env).value
          if (condition) {
            sexp = sexp.at(2)
          } else {
            if (sexp.at(3) !== undefined) {
              // (if test consequent alternative) case
              sexp = sexp.at(3)
            } else {
              // (if test consequent) case
              return FsUndefined.UNDEFINED
            }
          }
        } else if (FsSymbol.QUOTE === firstSymbol || FsSymbol.SINGLE_QUOTE === firstSymbol) {
          return sexp.at(1)
        } else if (FsSymbol.QUASIQUOTE === firstSymbol || FsSymbol.BACK_QUOTE === firstSymbol) {
          return FssQuasiQuote.proc(sexp.at(1), env)
        } else if (FsSymbol.DEFINE === firstSymbol) {
          return FssDefine.proc(sexp.slice(1), env)
        } else if (FsSymbol.DO === firstSymbol) {
          return FslsDo.proc(sexp.slice(1), env)
        } else if (FsSymbol.SET_ === firstSymbol) {
          return FssSet.proc(sexp.slice(1), env)
        } else if (FsSymbol.SET_CDR_ === firstSymbol) {
          return FspSetCdr.proc(sexp.slice(1), env)
        } else if (FsSymbol.COND === firstSymbol) {
          return FslsCond.proc(sexp.slice(1), env)
        } else if (FsSymbol.BEGIN === firstSymbol) {
          for (let i = 1; i < sexp.length - 1; i++) {
            FsEvaluator.eval(sexp.at(i), env)
          }
          sexp = sexp.at(sexp.length - 1)
        } else if (FsSymbol.LAMBDA === firstSymbol) {
          return FssLambda.proc(sexp.slice(1), env)
        } else if (FsSymbol.LET === firstSymbol) {
          return FslsLet.proc(sexp.slice(1), env)
        } else if (FsSymbol.LET_ASTERISK === firstSymbol) {
          return FslsLetAsterisk.proc(sexp.slice(1), env)
        } else if (FsSymbol.LETREC === firstSymbol || FsSymbol.LETREC_ASTERISK === firstSymbol) {
          return FslsLetRecAsterisk.proc(sexp.slice(1), env)
        } else if (FsSymbol.OR === firstSymbol) {
          return FslsOr.proc(sexp.slice(1), env)
        } else if (FsSymbol.MAP === firstSymbol || FsSymbol.FOR_EACH === firstSymbol) {
          return FslpMap.proc(sexp.slice(1), env)
        } else if (FsSymbol.DELAY === firstSymbol) {
          return FslsDelay.proc(sexp.slice(1), env)
        } else if (FsSymbol.CALL_WITH_CURRENT_CONTINUATION === firstSymbol || FsSymbol.CALL_CC === firstSymbol) {
          return FspCallCc.proc(sexp.slice(1), env)
        } else if (FsSymbol.CALL_WITH_VALUES === firstSymbol) {
          return FspCallWithValues.proc(sexp.slice(1), env)
        } else if (FsSymbol.DYNAMIC_WIND === firstSymbol) {
          return FspDynamicWind.proc(sexp.slice(1), env)
        } else {
          // for the readability, use this line
          // const args = sexp.slice(1).map(s => this.eval(s, env))

          // for the performance, use lines below. it may be bit faster.
          // const evaled = []
          // for (let i = 0; i < sexp.length; i++) {
          //   evaled.push(FsEvaluator.eval(sexp[i], env))
          // }
          const p = FsEvaluator.eval(firstSymbol, env)
          if (!p) {
            throw new FsException('Syntax error: got an unbound symbol: ' + firstSymbol)
          }
          if (p.type === 'FssDefinedprocedure') {
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
              innerEnv.set(p.params, new FsList(evaled), true) // override var name
              sexp = p.body.length === 1 ? p.body.at(0) : new FsList([FsSymbol.BEGIN, ...p.body.value])
              env = innerEnv
            } else {
              const givenParams = sexp.slice(1)
              // ex. (lambda (x) (+ 1 2))
              // fixed number "n" case or take "n or more" case
              if (p.params.type === 'fspair') {
                let treatLastArgAsList = false
                const paramAsList = []
                const currentPair = p.params
                const isProper = isProperList(currentPair)
                let nextPair = currentPair.cdr
                let argCount = 1
                if (nextPair.type !== 'fspair') {
                  // only (a . b) case

                  // last param is treated as list.
                  treatLastArgAsList = true
                  if (!(currentPair.car === FsList.EMPTY)) {
                    // ignore null for only (. b) case, for var args
                    paramAsList.push(currentPair.car)
                    argCount++
                  }
                  paramAsList.push(currentPair.cdr)
                } else {
                  // (a (b . c)) or more case
                  paramAsList.push(currentPair.car)
                  let hasNext = true
                  while (hasNext) {
                    if (nextPair.cdr !== undefined && nextPair.cdr.type !== 'fspair') {
                      paramAsList.push(nextPair.car)
                      paramAsList.push(nextPair.cdr)
                      hasNext = false
                      argCount += 2
                      treatLastArgAsList = true
                    } else {
                      // go to next pair
                      paramAsList.push(currentPair.car)
                      nextPair = currentPair.cdr
                      argCount++
                    }
                  }
                }
                // check param is proper pair
                if (isProper && (givenParams.length < paramAsList.length)) {
                  throw new FsException('this function requires at least ' + (paramAsList.length - 1) + ' argument(s)')
                } else if (!isProper && (givenParams.length <= argCount - 2)) {
                  // check for lambda (a b . c) case
                  throw new FsException('this function requires at least ' + (paramAsList.length - 1) + ' argument(s)')
                } else { // givenParams.length >== paramAsList.length - 1
                  const varNames = []
                  const results = []
                  const tmpEnv = new FsEnv(env)
                  if (!treatLastArgAsList) {
                    for (let i = 0; i < paramAsList.length; i++) {
                      varNames[i] = paramAsList[i]
                      // If call/cc appears as an argument, the rest of this
                      // procedure application is part of its continuation.
                      // Rebuild the application when that argument is supplied
                      // again by the saved continuation.
                      const parentContinuation = FsEvaluator.currentContinuation
                      const windBefore = FsEvaluator.currentWindBefore
                      results[i] = FsEvaluator.evalWithContinuation(givenParams.at(i), tmpEnv, value => {
                        results[i] = value
                        if (windBefore) windBefore()
                        for (let j = i + 1; j < paramAsList.length; j++) {
                          results[j] = FsEvaluator.eval(givenParams.at(j), tmpEnv)
                        }
                        for (let j = 0; j < varNames.length; j++) {
                          innerEnv.set(varNames[j], results[j], true)
                        }
                        const body = p.body.length === 1 ? p.body.at(0) : new FsList([FsSymbol.BEGIN, ...p.body.value])
                        const result = FsEvaluator.eval(body, innerEnv)
                        return parentContinuation ? parentContinuation(result) : result
                      })
                      tmpEnv.clearSelfVars() // reuse
                    }
                  } else {
                    for (let i = 0; i < paramAsList.length - 1; i++) {
                      varNames[i] = paramAsList[i]
                      results[i] = FsEvaluator.evalWithContinuation(givenParams.at(i), tmpEnv, FsEvaluator.currentContinuation)
                      tmpEnv.clearSelfVars() // reuse
                    }
                    const buf = []
                    varNames[paramAsList.length - 1] = paramAsList[paramAsList.length - 1]
                    for (let i = paramAsList.length - 1; i < givenParams.length; i++) {
                      buf.push(FsEvaluator.evalWithContinuation(givenParams.at(i), tmpEnv, FsEvaluator.currentContinuation))
                      tmpEnv.clearSelfVars() // reuse
                    }
                    results[paramAsList.length - 1] = new FsList(buf)
                  }
                  for (let i = 0; i < varNames.length; i++) {
                    innerEnv.set(varNames[i], results[i], true)
                  }
                }
                sexp = p.body.length === 1 ? p.body.at(0) : new FsList([FsSymbol.BEGIN, ...p.body.value])
                env = innerEnv
              } else if (p.params.type === 'fslist') {
                // values are evaled in separated env, results are not seen to other procs.
                const varNames = []
                const results = []
                const tmpEnv = new FsEnv(env)
                for (let i = 0; i < p.params.length; i++) {
                  varNames[i] = p.params.at(i)
                  // Keep the application frame alive while an argument is
                  // being evaluated. This is what lets a continuation return
                  // to the lambda call rather than only to the argument.
                  const parentContinuation = FsEvaluator.currentContinuation
                  const windBefore = FsEvaluator.currentWindBefore
                  results[i] = FsEvaluator.evalWithContinuation(givenParams.at(i), tmpEnv, value => {
                    results[i] = value
                    if (windBefore) windBefore()
                    for (let j = i + 1; j < p.params.length; j++) {
                      results[j] = FsEvaluator.eval(givenParams.at(j), tmpEnv)
                    }
                    for (let j = 0; j < varNames.length; j++) {
                      innerEnv.set(varNames[j], results[j], true)
                    }
                    const body = p.body.length === 1 ? p.body.at(0) : new FsList([FsSymbol.BEGIN, ...p.body.value])
                    const result = FsEvaluator.eval(body, innerEnv)
                    return parentContinuation ? parentContinuation(result) : result
                  })
                  tmpEnv.clearSelfVars() // reuse
                }
                for (let i = 0; i < varNames.length; i++) {
                  innerEnv.set(varNames[i], results[i], true) // override var name
                }

                sexp = p.body.length === 1 ? p.body.at(0) : new FsList([FsSymbol.BEGIN, ...p.body.value])
                env = innerEnv
              } else {
                throw new Error('not implemented')
              }
            }
          } else {
            // evaled.length = sexp.length - 1 // this line slows execution, so we do not do this.
            const evaled = new FsList()
            const tmpEnv = new FsEnv(env)
            for (let i = 1; i < sexp.length; i++) {
              const argumentIndex = i - 1
              const parentContinuation = FsEvaluator.currentContinuation
              const windBefore = FsEvaluator.currentWindBefore
              // For a primitive procedure, the saved continuation resumes by
              // putting the returned argument back into this argument list,
              // then applying the procedure and continuing outward.
              evaled.set(argumentIndex, FsEvaluator.evalWithContinuation(sexp.at(i), tmpEnv, value => {
                evaled.set(argumentIndex, value)
                if (windBefore) windBefore()
                const result = FsEvaluator.eval(new FsList([p, ...evaled.value]), env)
                return parentContinuation ? parentContinuation(result) : result
              }))
              tmpEnv.clearSelfVars() // reuse
            }
            return p(evaled, env) // for testing map
          }
        } // user-defined-proc or pre-defined proc
      } // list-case
    } // loop
  } // eval
}
