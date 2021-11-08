
// get global environment
'use strict'

import log from 'loglevel'

import { FsException } from './common.js'
import { FsNumber, FsPredicateInteger } from './datatypes.js'
import { FBS_QUASIQUOTE_LEVEL, FBS_UNQUOTE_LEVEL, FsEnv } from './env.js'
import { FslpAbs, FspDivide, FspGt, FspGte, FspLt, FspLte, FspMax, FspMin, FspMinus, FspMod, FspMultiply, FspNumberEquals, FspPlus, FspPow, FspRound, FspSqrt } from './math-operations.js'
import { FslpDisplay, FslpNewline, FslpWrite, FsopLoad, FspCloseInputPort, FspCloseOutputPort, FspConsoleInputPort, FspConsoleOutputPort, FspCurrentInputPort, FspCurrentOutputPort, FspOpenInputFile, FspOpenOutputFile, FspReadChar, FspStandardInputPort, FspStandardOutputPort } from './port.js'
import { FsPredicateBoolean, FsPredicateEq, FsPredicateEqual, FsPredicateEqv, FsPredicateList, FsPredicateNull, FsPredicateNumber, FsPredicatePair, FsPredicateProcedure, FsPredicateSymbol, FsPredicateVector } from './predicates.js'
import { FslpAppend, FslpLength, FslpList, FslpMap, FslpNot, FslsAnd, FslsDo, FslsLet, FspCallCc, FspCar, FspCdr, FspCons, FsPeekMemoryUsage, FspGensym, FspLastPair, FspSetCdr, FspSymbolToString, FssBegin, FssDefine, FssIf, FssLambda, FssSet, FssUnquote, FsUndefined } from './sexp.js'
import { FsSymbol } from './symbol.js'
import { FspMakeVector, FspVector, FspVectorRef, FspVectorSet } from './vector-operations.js'

export function getGlobalEnv () {
  const env = new FsEnv()
  const prev = log.getLevel()
  log.setLevel('error')

  // used in eval-each-switches
  env.set(FsSymbol.BACK_QUOTE, null)
  env.set(FsSymbol.BEGIN, FssBegin)
  env.set(FsSymbol.IF, FssIf)
  env.set(FsSymbol.DEFINE, FssDefine)
  env.set(FsSymbol.LAMBDA, FssLambda)
  env.set(FsSymbol.LET, FslsLet)
  env.set(FsSymbol.QUOTE, null)
  env.set(FsSymbol.SET_, FssSet)
  env.set(FsSymbol.SET_CDR_, FspSetCdr)
  env.set(FsSymbol.UNQUOTE, null) // treated inside of FssQuasiQuote()

  // used in eval-last
  env.set(new FsSymbol('+'), FspPlus.proc)
  // also we can provide JS function as value like below.
  // env.set(new FsSymbol('+'), (list) => { return new FsNumber(list.value.map(n => n.value).reduce((a, b) => a + b, 0)) })
  env.set(new FsSymbol('-'), FspMinus.proc)
  env.set(new FsSymbol('*'), FspMultiply.proc)
  env.set(new FsSymbol('/'), FspDivide.proc)
  env.set(new FsSymbol(','), FssUnquote.proc)
  env.set(new FsSymbol('mod'), FspMod.proc)
  env.set(new FsSymbol('pow'), FspPow.proc)
  env.set(new FsSymbol('='), FspNumberEquals.proc)
  env.set(new FsSymbol('<'), FspLt.proc)
  env.set(new FsSymbol('<='), FspLte.proc)
  env.set(new FsSymbol('>'), FspGt.proc)
  env.set(new FsSymbol('>='), FspGte.proc)
  env.set(new FsSymbol('\''), FsSymbol.SINGLE_QUOTE.proc)
  env.set(new FsSymbol('and'), FslsAnd.proc)
  env.set(new FsSymbol('append'), FslpAppend.proc)
  env.set(new FsSymbol('abs'), FslpAbs.proc)
  env.set(new FsSymbol('boolean?'), FsPredicateBoolean.proc)
  env.set(new FsSymbol('call-with-current-continuation'), FspCallCc.proc)
  env.set(new FsSymbol('call/cc'), FspCallCc.proc)
  env.set(new FsSymbol('car'), FspCar.proc)
  env.set(new FsSymbol('cdr'), FspCdr.proc)
  env.set(new FsSymbol('close-input-port'), FspCloseInputPort.proc)
  env.set(new FsSymbol('close-output-port'), FspCloseOutputPort.proc)
  env.set(new FsSymbol('cons'), FspCons.proc)
  env.set(new FsSymbol('current-input-port'), FspCurrentInputPort.proc)
  env.set(new FsSymbol('current-output-port'), FspCurrentOutputPort.proc)
  env.set(new FsSymbol('display'), FslpDisplay.proc)
  env.set(new FsSymbol('do'), FslsDo.proc)
  env.set(new FsSymbol('eq?'), FsPredicateEq.proc)
  env.set(new FsSymbol('eqv?'), FsPredicateEqv.proc)
  env.set(new FsSymbol('equal?'), FsPredicateEqual.proc)
  env.set(new FsSymbol('gensym'), FspGensym.proc)
  env.set(new FsSymbol('integer?'), FsPredicateInteger.proc)
  env.set(new FsSymbol('last-pair'), FspLastPair.proc)
  env.set(new FsSymbol('length'), FslpLength.proc)
  env.set(new FsSymbol('list'), FslpList.proc)
  env.set(new FsSymbol('list?'), FsPredicateList.proc)
  env.set(new FsSymbol('load'), FsopLoad.proc)
  env.set(new FsSymbol('make-vector'), FspMakeVector.proc)
  env.set(new FsSymbol('map'), FslpMap.proc)
  env.set(new FsSymbol('max'), FspMax.proc)
  env.set(new FsSymbol('min'), FspMin.proc)
  env.set(new FsSymbol('newline'), FslpNewline.proc)
  env.set(new FsSymbol('not'), FslpNot.proc)
  env.set(new FsSymbol('null?'), FsPredicateNull.proc)
  env.set(new FsSymbol('number?'), FsPredicateNumber.proc)
  env.set(new FsSymbol('open-input-file'), FspOpenInputFile.proc)
  env.set(new FsSymbol('open-output-file'), FspOpenOutputFile.proc)
  env.set(new FsSymbol('pair?'), FsPredicatePair.proc)
  env.set(new FsSymbol('procedure?'), FsPredicateProcedure.proc)
  // env.set(new FsSymbol('quasiquote'), FssQuasiQuote.proc)
  env.set(new FsSymbol('read-char'), FspReadChar.proc)
  env.set(new FsSymbol('round'), FspRound.proc)
  env.set(new FsSymbol('sqrt'), FspSqrt.proc)
  env.set(new FsSymbol('standard-input-port'), FspStandardInputPort.proc)
  env.set(new FsSymbol('standard-output-port'), FspStandardOutputPort.proc)
  env.set(new FsSymbol('symbol?'), FsPredicateSymbol.proc)
  env.set(new FsSymbol('symbol->string'), FspSymbolToString.proc)
  // env.set(new FsSymbol('unquote'), FssUnquote.proc)
  env.set(new FsSymbol('vector'), FspVector.proc)
  env.set(new FsSymbol('vector-ref'), FspVectorRef.proc)
  env.set(new FsSymbol('vector-set!'), FspVectorSet.proc)
  env.set(new FsSymbol('vector?'), FsPredicateVector.proc)
  env.set(new FsSymbol('write'), FslpWrite.proc)

  // used in specific forms
  // env.set(new FsSymbol('=>'), FsSymbol.TEST_IS_TRUE_THEN) // used in (cond

  // original
  env.set(new FsSymbol('exit'), (list) => {
    list !== undefined && list.length > 0 ? process.exit(list.at(0).value) : process.exit(0)
  })
  env.set(new FsSymbol('fs-set-loglevel'), (list) => {
    if (list === undefined || list.length !== 1) {
      throw new FsException('Syntax error : ' + list)
    }
    log.setLevel(list.at(0).value)
    return FsUndefined.UNDEFINED
  })
  env.set(new FsSymbol('peek-memory-usage'), FsPeekMemoryUsage.proc)

  env.set(FBS_QUASIQUOTE_LEVEL, new FsNumber(0))
  env.set(FBS_UNQUOTE_LEVEL, new FsNumber(0))

  // set default port
  env.setCurrentInputPort(new FspConsoleInputPort())
  env.setCurrentOutputPort(new FspConsoleOutputPort())

  log.setLevel(prev)
  return env
}
