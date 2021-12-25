
// get global environment
'use strict'

import log from 'loglevel'

import { FsException } from './common.js'
import { FslpListToString, FslpListToVector, FslpStringAppend, FslpStringCopy, FslpStringFill, FslpStringToList, FslpSubstring, FslpVectorFill_, FslpVectorToList, FsNumber, FspCharToInteger, FspIntegerToChar, FspMakeString, FsPredicateComplex, FsPredicateInteger, FsPredicateRational, FsPredicateReal, FspString, FspStringLength, FspStringRef, FspStringSet_ } from './datatypes.js'
import { FBS_QUASIQUOTE_LEVEL, FBS_UNQUOTE_LEVEL, FsEnv } from './env.js'
import { FslpAbs, FspAcos, FspAngle, FspAsin, FspAtan, FspCeiling, FspCos, FspDenominator, FspDivide, FspExactToInexact, FspExp, FspExpt, FspFloor, FspGcd, FspGt, FspGte, FspImagPart, FspInexactToExact, FspLcm, FspLog, FspLt, FspLte, FspMagnitude, FspMakePolar, FspMakeRectangular, FspMax, FspMin, FspMinus, FspMod, FspModulo, FspMultiply, FspNumberEquals, FspNumberToString, FspNumerator, FspPlus, FspPow, FspQuotient, FspRationalize, FspRealPart, FspReminder, FspRound, FspSin, FspSqrt, FspStringToNumber, FspTan, FspTruncate } from './math-operations.js'
import { FslpDisplay, FslpNewline, FslpWrite, FsopLoad, FspCloseInputPort, FspCloseOutputPort, FspConsoleInputPort, FspConsoleOutputPort, FspCurrentInputPort, FspCurrentOutputPort, FspOpenInputFile, FspOpenOutputFile, FspReadChar, FspStandardInputPort, FspStandardOutputPort } from './port.js'
import { FsPredicateBoolean, FsPredicateChar, FsPredicateCharEquals, FsPredicateCharGreaterThan, FsPredicateCharGreaterThanOrEqualsTo, FsPredicateCharLessThan, FsPredicateCharLessThanOrEqualsTo, FsPredicateEq, FsPredicateEqual, FsPredicateEqv, FsPredicateList, FsPredicateNull, FsPredicateNumber, FsPredicatePair, FsPredicateProcedure, FsPredicateString, FsPredicateSymbol, FsPredicateVector } from './predicates.js'
import { FsgpRaise, FslpAppend, FslpForce, FslpLength, FslpList, FslpMap, FslpNot, FslpReverse, FslsAnd, FslsDelay, FslsDo, FslsLet, FslsOr, FspApply, FspCallCc, FspCar, FspCdr, FspCons, FsPeekMemoryUsage, FspEval, FspGensym, FspLastPair, FspSetCdr, FspStringToSymbol, FspSymbolToString, FspValues, FssBegin, FssDefine, FssIf, FssLambda, FssSet, FssUnquote, FsUndefined } from './sexp.js'
import { FsSymbol } from './symbol.js'
import { FspMakeVector, FspVector, FspVectorRef, FspVectorSet } from './vector-operations.js'

export function getGlobalEnv () {
  const env = new FsEnv()
  const prev = log.getLevel()
  log.setLevel('error')

  // used in eval-each-switches
  env.set(FsSymbol.BACK_QUOTE, null, true)
  env.set(FsSymbol.BEGIN, FssBegin, true)
  env.set(FsSymbol.IF, FssIf, true)
  env.set(FsSymbol.DEFINE, FssDefine, true)
  env.set(FsSymbol.LAMBDA, FssLambda, true)
  env.set(FsSymbol.LET, FslsLet, true)
  env.set(FsSymbol.QUOTE, null, true)
  env.set(FsSymbol.SET_, FssSet, true)
  env.set(FsSymbol.SET_CDR_, FspSetCdr, true)
  env.set(FsSymbol.UNQUOTE, null, true) // treated inside of FssQuasiQuote(, true)

  // used in eval-last
  env.set(new FsSymbol('+'), FspPlus.proc, true)
  // also we can provide JS function as value like below.
  // env.set(new FsSymbol('+'), (list) => { return new FsNumber(list.value.map(n => n.value).reduce((a, b) => a + b, 0)) }, true)
  env.set(new FsSymbol('-'), FspMinus.proc, true)
  env.set(new FsSymbol('*'), FspMultiply.proc, true)
  env.set(new FsSymbol('/'), FspDivide.proc, true)
  env.set(new FsSymbol(','), FssUnquote.proc, true)
  env.set(new FsSymbol('mod'), FspMod.proc, true)
  env.set(new FsSymbol('pow'), FspPow.proc, true)
  env.set(new FsSymbol('='), FspNumberEquals.proc, true)
  env.set(new FsSymbol('<'), FspLt.proc, true)
  env.set(new FsSymbol('<='), FspLte.proc, true)
  env.set(new FsSymbol('>'), FspGt.proc, true)
  env.set(new FsSymbol('>='), FspGte.proc, true)
  env.set(new FsSymbol('\''), FsSymbol.SINGLE_QUOTE.proc, true)
  env.set(new FsSymbol('and'), FslsAnd.proc, true)
  env.set(new FsSymbol('angle'), FspAngle.proc, true)
  env.set(new FsSymbol('append'), FslpAppend.proc, true)
  env.set(new FsSymbol('apply'), FspApply.proc, true)
  env.set(new FsSymbol('abs'), FslpAbs.proc, true)
  env.set(new FsSymbol('acos'), FspAcos.proc, true)
  env.set(new FsSymbol('asin'), FspAsin.proc, true)
  env.set(new FsSymbol('atan'), FspAtan.proc, true)
  env.set(new FsSymbol('boolean?'), FsPredicateBoolean.proc, true)
  env.set(new FsSymbol('call-with-current-continuation'), FspCallCc.proc, true)
  env.set(new FsSymbol('call/cc'), FspCallCc.proc, true)
  env.set(new FsSymbol('car'), FspCar.proc, true)
  env.set(new FsSymbol('cdr'), FspCdr.proc, true)
  env.set(new FsSymbol('ceiling'), FspCeiling.proc, true)
  env.set(new FsSymbol('char->integer'), FspCharToInteger.proc, true)
  env.set(new FsSymbol('char<?'), FsPredicateCharLessThan.proc, true)
  env.set(new FsSymbol('char<=?'), FsPredicateCharLessThanOrEqualsTo.proc, true)
  env.set(new FsSymbol('char=?'), FsPredicateCharEquals.proc, true)
  env.set(new FsSymbol('char>?'), FsPredicateCharGreaterThan.proc, true)
  env.set(new FsSymbol('char>=?'), FsPredicateCharGreaterThanOrEqualsTo.proc, true)
  env.set(new FsSymbol('char?'), FsPredicateChar.proc, true)
  env.set(new FsSymbol('close-input-port'), FspCloseInputPort.proc, true)
  env.set(new FsSymbol('close-output-port'), FspCloseOutputPort.proc, true)
  env.set(new FsSymbol('complex?'), FsPredicateComplex.proc, true)
  env.set(new FsSymbol('cons'), FspCons.proc, true)
  env.set(new FsSymbol('cos'), FspCos.proc, true)
  env.set(new FsSymbol('current-input-port'), FspCurrentInputPort.proc, true)
  env.set(new FsSymbol('current-output-port'), FspCurrentOutputPort.proc, true)
  env.set(new FsSymbol('denominator'), FspDenominator.proc, true)
  env.set(new FsSymbol('display'), FslpDisplay.proc, true)
  env.set(new FsSymbol('delay'), FslsDelay.proc, true)
  env.set(new FsSymbol('do'), FslsDo.proc, true)
  env.set(new FsSymbol('eq?'), FsPredicateEq.proc, true)
  env.set(new FsSymbol('eqv?'), FsPredicateEqv.proc, true)
  env.set(new FsSymbol('equal?'), FsPredicateEqual.proc, true)
  env.set(new FsSymbol('exact->inexact'), FspExactToInexact.proc, true)
  env.set(new FsSymbol('eval'), FspEval.proc, true)
  env.set(new FsSymbol('exp'), FspExp.proc, true)
  env.set(new FsSymbol('expt'), FspExpt.proc, true)
  env.set(new FsSymbol('floor'), FspFloor.proc, true)
  env.set(new FsSymbol('for-each'), FslpMap.proc, true)
  env.set(new FsSymbol('force'), FslpForce.proc, true)
  env.set(new FsSymbol('gcd'), FspGcd.proc, true)
  env.set(new FsSymbol('gensym'), FspGensym.proc, true)
  env.set(new FsSymbol('imag-part'), FspImagPart.proc, true)
  env.set(new FsSymbol('inexact->exact'), FspInexactToExact.proc, true)
  env.set(new FsSymbol('integer->char'), FspIntegerToChar.proc, true)
  env.set(new FsSymbol('integer?'), FsPredicateInteger.proc, true)
  env.set(new FsSymbol('last-pair'), FspLastPair.proc, true)
  env.set(new FsSymbol('lcm'), FspLcm.proc, true)
  env.set(new FsSymbol('length'), FslpLength.proc, true)
  env.set(new FsSymbol('list'), FslpList.proc, true)
  env.set(new FsSymbol('list->string'), FslpListToString.proc, true)
  env.set(new FsSymbol('list->vector'), FslpListToVector.proc, true)
  env.set(new FsSymbol('list?'), FsPredicateList.proc, true)
  env.set(new FsSymbol('load'), FsopLoad.proc, true)
  env.set(new FsSymbol('log'), FspLog.proc, true)
  env.set(new FsSymbol('magnitude'), FspMagnitude.proc, true)
  env.set(new FsSymbol('make-polar'), FspMakePolar.proc, true)
  env.set(new FsSymbol('make-rectangular'), FspMakeRectangular.proc, true)
  env.set(new FsSymbol('make-string'), FspMakeString.proc, true)
  env.set(new FsSymbol('make-vector'), FspMakeVector.proc, true)
  env.set(new FsSymbol('map'), FslpMap.proc, true)
  env.set(new FsSymbol('max'), FspMax.proc, true)
  env.set(new FsSymbol('min'), FspMin.proc, true)
  env.set(new FsSymbol('modulo'), FspModulo.proc, true)
  env.set(new FsSymbol('newline'), FslpNewline.proc, true)
  env.set(new FsSymbol('not'), FslpNot.proc, true)
  env.set(new FsSymbol('null?'), FsPredicateNull.proc, true)
  env.set(new FsSymbol('number->string'), FspNumberToString.proc, true)
  env.set(new FsSymbol('number?'), FsPredicateNumber.proc, true)
  env.set(new FsSymbol('numerator'), FspNumerator.proc, true)
  env.set(new FsSymbol('or'), FslsOr.proc, true)
  env.set(new FsSymbol('open-input-file'), FspOpenInputFile.proc, true)
  env.set(new FsSymbol('open-output-file'), FspOpenOutputFile.proc, true)
  env.set(new FsSymbol('pair?'), FsPredicatePair.proc, true)
  env.set(new FsSymbol('procedure?'), FsPredicateProcedure.proc, true)
  // env.set(new FsSymbol('quasiquote'), FssQuasiQuote.proc, true)
  env.set(new FsSymbol('reverse'), FslpReverse.proc, true)
  env.set(new FsSymbol('quotient'), FspQuotient.proc, true)
  env.set(new FsSymbol('real-part'), FspRealPart.proc, true)
  env.set(new FsSymbol('rationalize'), FspRationalize.proc, true)
  env.set(new FsSymbol('rational?'), FsPredicateRational.proc, true)
  env.set(new FsSymbol('read-char'), FspReadChar.proc, true)
  env.set(new FsSymbol('real?'), FsPredicateReal.proc, true)
  env.set(new FsSymbol('remainder'), FspReminder.proc, true)
  env.set(new FsSymbol('round'), FspRound.proc, true)
  env.set(new FsSymbol('sin'), FspSin.proc, true)
  env.set(new FsSymbol('sqrt'), FspSqrt.proc, true)
  env.set(new FsSymbol('standard-input-port'), FspStandardInputPort.proc, true)
  env.set(new FsSymbol('standard-output-port'), FspStandardOutputPort.proc, true)
  env.set(new FsSymbol('string'), FspString.proc, true)
  env.set(new FsSymbol('string-append'), FslpStringAppend.proc, true)
  env.set(new FsSymbol('string-copy'), FslpStringCopy.proc, true)
  env.set(new FsSymbol('string-fill'), FslpStringFill.proc, true)
  env.set(new FsSymbol('string->list'), FslpStringToList.proc, true)
  env.set(new FsSymbol('string->number'), FspStringToNumber.proc, true)
  env.set(new FsSymbol('string->symbol'), FspStringToSymbol.proc, true)
  env.set(new FsSymbol('string-length'), FspStringLength.proc, true)
  env.set(new FsSymbol('string-ref'), FspStringRef.proc, true)
  env.set(new FsSymbol('string-set!'), FspStringSet_.proc, true)
  // env.set(new FsSymbol('string=?'), FsPredicateStringEquals.proc, true)
  env.set(new FsSymbol('string?'), FsPredicateString.proc, true)
  env.set(new FsSymbol('substring'), FslpSubstring.proc, true)
  env.set(new FsSymbol('symbol?'), FsPredicateSymbol.proc, true)
  env.set(new FsSymbol('symbol->string'), FspSymbolToString.proc, true)
  env.set(new FsSymbol('tan'), FspTan.proc, true)
  env.set(new FsSymbol('truncate'), FspTruncate.proc, true)
  // env.set(new FsSymbol('unquote'), FssUnquote.proc, true)
  env.set(new FsSymbol('values'), FspValues.proc, true)
  env.set(new FsSymbol('vector'), FspVector.proc, true)
  env.set(new FsSymbol('vector->list'), FslpVectorToList.proc, true)
  env.set(new FsSymbol('vector-fill!'), FslpVectorFill_.proc, true)
  env.set(new FsSymbol('vector-ref'), FspVectorRef.proc, true)
  env.set(new FsSymbol('vector-set!'), FspVectorSet.proc, true)
  env.set(new FsSymbol('vector?'), FsPredicateVector.proc, true)
  env.set(new FsSymbol('write'), FslpWrite.proc, true)

  // used in specific forms
  // env.set(new FsSymbol('=>'), FsSymbol.TEST_IS_TRUE_THEN) // used in (cond

  // original
  env.set(new FsSymbol('exit'), (list) => {
    list !== undefined && list.length > 0 ? process.exit(list.at(0).value) : process.exit(0)
  }, true)
  env.set(new FsSymbol('fs-set-loglevel'), (list) => {
    if (list === undefined || list.length !== 1) {
      throw new FsException('Syntax error : ' + list)
    }
    log.setLevel(list.at(0).value)
    return FsUndefined.UNDEFINED
  }, true)
  env.set(new FsSymbol('peek-memory-usage'), FsPeekMemoryUsage.proc, true)
  env.set(new FsSymbol('raise'), FsgpRaise.proc, true)

  env.set(FBS_QUASIQUOTE_LEVEL, new FsNumber(0), true)
  env.set(FBS_UNQUOTE_LEVEL, new FsNumber(0), true)

  // set default port
  env.setCurrentInputPort(new FspConsoleInputPort(), true)
  env.setCurrentOutputPort(new FspConsoleOutputPort(), true)

  log.setLevel(prev)
  return env
}
