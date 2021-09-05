'use strict'

import { FsAnd, FsBegin, FsCar, FsCdr, FsCons, FsDefine, FsDisplay, FsIf, FsLambda, FsLet, FsList, FsNewline, FsNot, FsNumberEquals, FsOperatorAbs, FsOperatorDivide, FsOperatorGt, FsOperatorGte, FsOperatorLt, FsOperatorLte, FsOperatorMinus, FsOperatorMod, FsOperatorMultiply, FsOperatorPlus, FsOperatorPow, FsOperatorRound, FsPeekMemoryUsage, FsPredicateBoolean, FsPredicateEq, FsPredicateEqual, FsPredicateList, FsPredicateNull, FsPredicateNumber, FsPredicateProcedure, FsPredicateSymbol, FsProcedureAppend, FsProcedureMap, FsProcedureMax, FsProcedureMin, FsQuote, FsSet, FsSymbol, FsWrite } from './sexp.js'
import log from 'loglevel'
import { FsError, FsException } from './common.js'

// Environment
export class FsEnv {
  // static counter = 0

  // use {} instead of new Map() because it is bit faster on benchmarking on fib(30)
  // constructor (outer = null, vars = new Map()) {
  constructor (outer = null, vars = Object.create(null)) {
    this.outer = outer
    this.vars = vars
    // this._id = FsEnv.counter++
  }

  get id () {
    return this._id
  }

  // Object keys in JS Map are compared by its ref.
  // Here we convert FsSymbol to string in case we don't have its reference.
  static toKey (obj) {
    if (obj instanceof FsSymbol) {
      // return obj.toString()
      // value of FsSymbol is not falcy. simply use its value as key.
      return obj.value
    } else {
      throw new FsError('cannot use as key:' + obj)
    }
  }

  set (k, v) {
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('---------------------------------')
      log.debug('env-set k=:' + k + ',v:' + v + ',in:id=' + this.id)
      log.debug('---------------------------------')
    }
    this.vars[FsEnv.toKey(k)] = v
  }

  find (symbol) {
    const key = FsEnv.toKey(symbol)
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('env-find:' + symbol + ' in:' + this + ' key:' + key)
    }

    const v = this.vars[key]
    if (v !== undefined) {
      return v
    } else if (this.outer !== null) {
      // calling outer like below results in exeeding maximum call stack,
      // so we simply use for-loop in this method, and do nut use recursive call.
      //
      // return this.outer.find(symbol)
      let nextOuter = this.outer
      while (nextOuter !== null) {
        const v = nextOuter.vars[key]
        if (v !== undefined) {
          return v
        }
        nextOuter = nextOuter.outer
      }
    } else {
      throw new FsException('Symbol [' + symbol + '] is not found.')
    }
  }

  toString () {
    if (this.outer === null) {
      return '>>ROOT'
    } else {
      // return '>>id' + this.id + ' [' + Array.from(this.vars.keys()).map(k => k + '=' + this.vars.get(k)) + ']'
      return JSON.stringify(this.vars)
    }
  }
}

// get global environment
export function getGlobalEnv () {
  const env = new FsEnv()
  const prev = log.getLevel()
  log.setLevel('error')
  // used in eval-each-switches
  env.set(FsSymbol.IF, FsIf)
  env.set(FsSymbol.QUOTE, FsQuote)
  env.set(FsSymbol.DEFINE, FsDefine)
  env.set(FsSymbol.SET_, FsSet)
  env.set(FsSymbol.BEGIN, FsBegin)
  env.set(FsSymbol.LAMBDA, FsLambda)
  env.set(FsSymbol.LET, FsLet)
  // used in eval-last
  env.set(new FsSymbol('+'), FsOperatorPlus.proc)
  env.set(new FsSymbol('-'), FsOperatorMinus.proc)
  env.set(new FsSymbol('*'), FsOperatorMultiply.proc)
  env.set(new FsSymbol('/'), FsOperatorDivide.proc)
  env.set(new FsSymbol('mod'), FsOperatorMod.proc)
  env.set(new FsSymbol('pow'), FsOperatorPow.proc)
  env.set(new FsSymbol('='), FsNumberEquals.proc)
  env.set(new FsSymbol('<'), FsOperatorLt.proc)
  env.set(new FsSymbol('<='), FsOperatorLte.proc)
  env.set(new FsSymbol('>'), FsOperatorGt.proc)
  env.set(new FsSymbol('>='), FsOperatorGte.proc)
  env.set(new FsSymbol('\''), FsSymbol.SINGLE_QUOTE.proc)
  env.set(new FsSymbol('and'), FsAnd.proc)
  env.set(new FsSymbol('append'), FsProcedureAppend.proc)
  env.set(new FsSymbol('abs'), FsOperatorAbs.proc)
  env.set(new FsSymbol('boolean?'), FsPredicateBoolean.proc)
  env.set(new FsSymbol('car'), FsCar.proc)
  env.set(new FsSymbol('cdr'), FsCdr.proc)
  env.set(new FsSymbol('cons'), FsCons.proc)
  env.set(new FsSymbol('display'), FsDisplay.proc)
  env.set(new FsSymbol('eq?'), FsPredicateEq.proc)
  env.set(new FsSymbol('equal?'), FsPredicateEqual.proc)
  env.set(new FsSymbol('list'), FsList.proc)
  env.set(new FsSymbol('list?'), FsPredicateList.proc)
  env.set(new FsSymbol('newline'), FsNewline.proc)
  env.set(new FsSymbol('map'), FsProcedureMap.proc)
  env.set(new FsSymbol('max'), FsProcedureMax.proc)
  env.set(new FsSymbol('min'), FsProcedureMin.proc)
  env.set(new FsSymbol('null?'), FsPredicateNull.proc)
  env.set(new FsSymbol('number?'), FsPredicateNumber.proc)
  env.set(new FsSymbol('not'), FsNot.proc)
  env.set(new FsSymbol('procedure?'), FsPredicateProcedure.proc)
  env.set(new FsSymbol('round'), FsOperatorRound.proc)
  env.set(new FsSymbol('symbol?'), FsPredicateSymbol.proc)
  env.set(new FsSymbol('write'), FsWrite.proc)
  env.set(new FsSymbol('peek-memory-usage'), FsPeekMemoryUsage.proc)

  log.setLevel(prev)
  return env
}
