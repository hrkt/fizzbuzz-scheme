// various S-expressions
'use strict'

import { FsEvaluator } from './evaluator.js'
import log from 'loglevel'
import { FsError, FsException } from './common.js'
import { FsEnv } from './env.js'

export class SExpFactory {
  static build (s) {
    if (s === undefined) {
      throw new FsError('passed undefined.') // isNaN(undefined) ==> true
    }
    if (!isNaN(parseFloat(s)) && !isNaN(s - 0)) {
      return new FsNumber(+s)
    } else if (FsBoolean.isFsBooleanString(s)) {
      return FsBoolean.fromString(s)
    } else if (FsChar.isFsChar(s)) {
      return FsChar.fromString(s)
    } else if (s.startsWith('"')) { // equal or faster compared to  s.charAt(0), s.indexOf('"') === 0
      const extracted = s.substring(1, s.length - 1)
      return new FsString(extracted)
    } else {
      return FsSymbol.intern(s) // avoid creating Gabage
    }
  }
}

export class FsSExp {
  constructor (value = null) {
    if (this.constructor === FsSExp) {
      throw new FsError('FsSexp class can\'t be instantiated.')
    }
  }

  get type () {
    return 'fssexp'
  }

  equals (that) {
    // used in expect .toBe()
    return undefined !== that && (this.value === that.value)
  }

  toString () {
    return this.constructor.name
  }
}

export class FsAtom extends FsSExp {
  constructor (value = null) {
    super()
    if (this.constructor === FsAtom) {
      throw new FsError('FsAtom class can\'t be instantiated.')
    }
    this.value = value
  }

  toString () {
    return this.value === null ? 'null' : this.value.toString()
  }
}

export class FsIf extends FsSExp {
  /**
   * @deprecated since version 0.1.6, this function is inlined to eval-loop
   */
  static proc (list, env) {
    throw new FsError('do not call me.')
    // const [test, conseq, alt] = list
    // if (FsEvaluator.eval(test, env).value) {
    //   return FsEvaluator.eval(conseq, env)
    // } else {
    //   return FsEvaluator.eval(alt, env)
    // }
  }
}

export class FsLambda extends FsSExp {
  static proc (list, env) {
    const params = list.at(0)

    let body = null
    if (params instanceof FsSymbol) {
      body = list
    } else {
      body = list.at(1)
    }
    const procedure = new FsDefinedProcedure(params, body, env)
    return procedure
  }
}

export class FsDefinedProcedure extends FsSExp {
  constructor (params, body, env) {
    super()
    this.params = params
    this.body = body
    this.env = env

    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('ctor. FsDefinedProcedure with params:' + params + ',body:' + body)
      log.debug('--params--')
      log.debug(params)
      log.debug('--body--')
      log.debug(body)
      log.debug('------')
    }
  }

  /**
   * @deprecated since version 0.1.6, this function is inlined to eval-loop
   */
  proc (execParams) {
    throw new FsError('do not call me.')
    // const innerEnv = new FsEnv(this.env)
    // if (!Array.isArray(execParams)) {
    //   throw new Error('arg type do not match')
    // }
    // if (this.params instanceof FsSymbol) {
    //   // ex. ((lambda x x) 3 4 5 6)
    //   innerEnv.set(this.params, new FsList(execParams))
    //   return FsEvaluator.eval(this.params, innerEnv)
    // } else {
    //   // ex. (lambda (x) (+ 1 2))
    //   for (let i = 0; i < this.params.length; i++) {
    //     innerEnv.set(this.params[i], execParams[i])
    //   }
    //   return FsEvaluator.eval(this.body, innerEnv)
    // }
  }

  toString () {
    return 'FsDefinedProcedure - params:' + this.params + ' body:' + this.body + ' defined-in:env' + this.env.id
  }

  get type () {
    return 'fsdefinedprocedure'
  }
}

export class FsLet extends FsSExp {
  static proc (list, env) {
    ensureListContainsTwo(list)
    let varDefs = null
    if (Array.isArray(list) && !(Array.isArray(list.at(0).at(0)))) {
      throw new FsException('syntax error: bindings should have the form ((k 1) ..')
    } else {
      varDefs = list.at(0)
    }

    const innerEnv = new FsEnv(env)
    for (let i = 0; i < varDefs.length; i++) {
      innerEnv.set(varDefs.at(i).at(0), FsEvaluator.eval(varDefs.at(i).at(1), env))
    }

    const body = list.at(1)

    return FsEvaluator.eval(body, innerEnv)
  }

  toString () {
    return 'FsDefinedProcedure - params:' + this.params + ' body:' + this.body + ' defined-in:env' + this.env.id
  }
}

// https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-7.html#%_sec_4.1.6
export class FsDefine extends FsSExp {
  static proc (list, env) {
    ensureListContainsTwo(list)
    const car = list.at(0)
    const cdr = list.at(1)

    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('car:' + car + ',cdr:' + cdr)
      log.debug('DUMP-IN-DEFINE car')
      console.dir(car)
      log.debug('DUMP-IN-DEFINE cdr')
      console.dir(cdr)
    }

    if (!(car instanceof FsList)) {
      // ex)
      // (define x1 (lambda (x) (* x 2)))
      env.set(car, FsEvaluator.eval(cdr, env))
      return car
    } else {
      // ex)
      // (define (x2 x) (* x 2))
      const funcName = car.at(0)
      const params = car.slice(1)
      const body = cdr
      const procedure = new FsDefinedProcedure(params, body, env)
      if (log.getLevel() <= log.levels.DEBUG) {
        log.debug('define funciton - funcName:' + funcName + ' procedure:' + procedure)
      }
      env.set(funcName, procedure)
      return funcName
    }
  }
}

// https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-7.html#%_sec_4.1.6
export class FsSet extends FsSExp {
  static proc (list, env) {
    ensureListContainsTwo(list)
    const symbol = list.at(0)
    const newValue = list.at(1)

    try {
      const prev = env.find(symbol)
      if (log.getLevel() <= log.levels.DEBUG) {
        log.debug('set! - pref:' + prev + ' new:' + newValue)
      }
      env.set(symbol, newValue)
      return FsUndefined.UNDEFINED
    } catch (e) {
      throw new FsException('symbol must be defined before calling "set!"')
    }
  }
}

export class FsBegin extends FsSExp {
  /**
   * @deprecated since version 0.1.6, this function is inlined to eval-loop
   */
  static proc (list, env) {
    throw new FsError('do not call me.')
    // let ret = null
    // for (let i = 0; i < list.length; i++) {
    //   ret = FsEvaluator.eval(list[i], env)
    // }
    // return ret
  }
}

export class FsQuote extends FsSExp {
  static proc (arg) {
    // arg ... ex) [{"_value":"'"},{"_value":"a"}]
    // '(a (b)) => (a (b))
    const quoteList = arg
    if (quoteList.at(0) instanceof FsList) {
      const innerList = quoteList.at(0)
      if (FsSymbol.SINGLE_QUOTE.equals(innerList.at(0))) {
        log.debug('returning FsList starting with FsSybol.SINGLE_QUOTE')
        return new FsList([innerList.at(0), FsQuote.proc(innerList.slice(1))])
      } else {
        log.debug('returning FsList')
        return FsList.proc(innerList)
      }
    } else {
      return new FsList(arg.value)
    }
  }
}

export class FsBoolean extends FsAtom {
  static TRUE_ = Object.freeze(new FsBoolean(true))
  static FALSE_ = Object.freeze(new FsBoolean(false))

  static get TRUE () { return FsBoolean.TRUE_ }
  static get FALSE () { return FsBoolean.FALSE_ }
  // using these direct call do not increase performance, so we use getter
  // static TRUE = FsBoolean.TRUE_
  // static FALSE = FsBoolean.FALSE_

  static isFsBooleanString (s) {
    return (s === '#t' || s === '#f')
  }

  static fromString (s) {
    if (s === '#t') {
      return FsBoolean.TRUE
    } else if (s === '#f') {
      return FsBoolean.FALSE
    }
  }

  toString () {
    return this.value ? '#t' : '#f'
  }
}

export class FsNumber extends FsAtom {
  toString () {
    return this.value
  }

  equals (target) {
    return this.value === target.value
  }

  get type () {
    return 'fsnumber'
  }
}

export class FsChar extends FsAtom {
  static isFsChar (s) {
    return (s.charAt(0) === '#' && s.charAt(1) === '\\' && s.length === 3)
  }

  static fromString (s) {
    // s is "#\a" and previously checked its format.
    return new FsChar(s.charAt(2))
  }

  toString () {
    return this.value
  }

  equals (target) {
    return this.value === target.value
  }
}

export class FsString extends FsAtom {
  toString () {
    return '"' + this.value + '"'
  }
}

export class FsSymbol extends FsAtom {
  static IF = Object.freeze(new FsSymbol('if'))
  static QUOTE = Object.freeze(new FsSymbol('quote'))
  static SINGLE_QUOTE = Object.freeze(new FsSymbol('\''))
  static DEFINE = Object.freeze(new FsSymbol('define'))
  static SET_ = Object.freeze(new FsSymbol('set!'))
  static SET_CDR_ = Object.freeze(new FsSymbol('set-cdr!'))
  static BEGIN = Object.freeze(new FsSymbol('begin'))
  static LAMBDA = Object.freeze(new FsSymbol('lambda'))
  static LET = Object.freeze(new FsSymbol('let'))
  static DOT = Object.freeze(new FsSymbol('.'))
  static intern (str) {
    switch (str) {
      case 'if':
        return this.IF
      case 'quote':
        return this.QUOTE
      case '\'':
        return this.SINGLE_QUOTE
      case 'define':
        return this.DEFINE
      case 'set!':
        return this.SET_
      case 'set-cdr!':
        return this.SET_CDR_
      case 'begin':
        return this.BEGIN
      case 'lambda':
        return this.LAMBDA
      case 'let':
        return this.LET
      case '.':
        return this.DOT
      default:
        return Object.freeze(new FsSymbol(str))
    }
  }

  get type () {
    return 'fssymbol'
  }
}

export class FsUndefined extends FsAtom {
  static UNDEFINED_ = new FsUndefined()

  static get UNDEFINED () { return FsUndefined.UNDEFINED_ }

  toString () {
    return '#undefined'
  }
}

function ensureListContains (list, length) {
  if (!(list instanceof FsList) || list.length !== length) {
    throw new FsException('this procedure must take ' + length + ' argument(s) as list')
  }
}

function ensureListContainsTwo (list) {
  ensureListContains(list, 2)
}

function ensureListContainsOne (list) {
  ensureListContains(list, 1)
}

export class FsProcedureAbs extends FsSExp {
  static proc (list) {
    if (!(list.at(0) instanceof FsNumber)) {
      throw new FsException('arg must be number')
    }
    return new FsNumber(Math.abs(list.at(0).value))
  }
}

export class FsProcedurePlus extends FsSExp {
  static proc (list) {
    // for the readability, use this line
    // return new FsNumber(list.map(n => n.value).reduce((a, b) => a + b, 0))

    // for the performance, use lines below. it may be bit faster.
    //
    if (list.length === 2) {
      return new FsNumber(list.at(0).value + list.at(1).value)
    } else if (list.length === 1) {
      return new FsNumber(-1 * (list.at(0).value))
    } else {
      let buf = 0
      for (let i = 0; i < list.length; i++) {
        buf += list.at(i).value
      }
      return new FsNumber(buf)
    }
  }
}

export class FsProcedureRound extends FsSExp {
  static proc (list) {
    return new FsNumber(Math.round(list.at(0).value))
  }
}

export class FsProcedureMultiply extends FsSExp {
  static proc (list) {
    // return new FsNumber(list.map(n => n.value).reduce((a, b) => a * b, 1))
    let buf = list.at(0).value
    for (let i = 1; i < list.length; i++) {
      buf *= list.at(i).value
    }
    return new FsNumber(buf)
  }
}

export class FsProcedureMinus extends FsSExp {
  static proc (list) {
    if (list.length === 2) {
      return new FsNumber(list.at(0).value - list.at(1).value)
    } else if (list.length === 1) {
      return new FsNumber(-1 * (list.at(0).value))
    } else {
      // for the readability, use this line
      // return new FsNumber(list.at(0).value - FsProcedurePlus.proc(list.slice(1)))

      // for the performance, use lines below. it may be bit faster.
      //
      let buf = list.at(0).value
      for (let i = 1; i < list.length; i++) {
        buf -= list.at(i)
      }
      return new FsNumber(buf)
    }
  }
}

export class FsProcedureDivide extends FsSExp {
  static proc (list) {
    if (list.length === 1) {
      // TODO: support rational number
      if (list.at(0).value !== 0) {
        return new FsNumber(list.at(0).value)
      } else {
        throw new FsException('divide by 0')
      }
    } else {
      const divisor = FsProcedureMultiply.proc(list.slice(1))
      if (divisor.value !== 0) {
        return new FsNumber(list.at(0).value / divisor.value)
      } else {
        throw new FsException('divide by 0')
      }
    }
  }
}

export class FsProcedureMod extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const dividend = list.at(0).value
    const divisor = list.at(1).value
    return new FsNumber(dividend % divisor)
  }
}

export class FsProcedurePow extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    return new FsNumber(Math.pow(list.at(0).value, list.at(1).value))
  }
}

// in scheme,
// '=' checks two numbers are equal,
// eqv?, eq are described in 6.1 https://schemers.org/Documents/Standards/R5RS/HTML/r5rs-Z-H-9.html#%_sec_6.1
export class FsEquals extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const lhs = list.at(0)
    const rhs = list.at(1)
    if (lhs instanceof FsNumber && rhs instanceof FsNumber) {
      return lhs.equals(rhs) ? FsBoolean.TRUE : FsBoolean.FALSE
    } else {
      // prerequisites: only ascii characters are permitted
      return lhs.toString() === rhs.toString() ? FsBoolean.TRUE : FsBoolean.FALSE
      // non-ascii
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
      // return lhs.toString().normalize() === rhs.toString().normalize()? FsBoolean.TRUE : FsBoolean.FALSE
    }
  }
}

export class FsPredicateEq extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const lhs = list.at(0)
    const rhs = list.at(1)
    if (lhs instanceof FsNumber && rhs instanceof FsNumber) {
      return lhs.equals(rhs) ? FsBoolean.TRUE : FsBoolean.FALSE
    } else if (lhs instanceof FsChar && rhs instanceof FsChar) {
      return lhs.equals(rhs) ? FsBoolean.TRUE : FsBoolean.FALSE
    } else if (lhs instanceof FsSymbol && rhs instanceof FsSymbol) {
      // ex. (eq? 'a 'a)
      return lhs.value === rhs.value ? FsBoolean.TRUE : FsBoolean.FALSE
    } else if (lhs instanceof FsList && rhs instanceof FsList) {
      if (lhs.length === 0 && rhs.length === 0) {
        return FsBoolean.TRUE
      } else if ((lhs.length === 1 && rhs.length === 1) &&
      (lhs.at(0) === rhs.at(0))) {
        // ex. (let ((x \'(a))) (eq? x x)); 2 objects point the same object on the memory
        // ; It is not the comparison between their values
        return FsBoolean.TRUE
      } else {
        return FsBoolean.FALSE
      }
    } else {
      // prerequisites: only ascii characters are permitted
      return lhs === rhs ? FsBoolean.TRUE : FsBoolean.FALSE
      // non-ascii
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
      // return lhs.toString().normalize() === rhs.toString().normalize()? FsBoolean.TRUE : FsBoolean.FALSE
    }
  }
}

export class FsPredicateEqual extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const lhs = list.at(0)
    const rhs = list.at(1)

    if (lhs instanceof FsList && rhs instanceof FsList) {
      // TODO: this might not be fast, but works.
      return JSON.stringify(lhs) === JSON.stringify(rhs) ? FsBoolean.TRUE : FsBoolean.FALSE
    } else {
      // prerequisites: only ascii characters are permitted
      return lhs.toString() === rhs.toString() ? FsBoolean.TRUE : FsBoolean.FALSE
      // non-ascii
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
      // return lhs.toString().normalize() === rhs.toString().normalize()? FsBoolean.TRUE : FsBoolean.FALSE
    }
  }
}

export class FsNumberEquals extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const lhs = list.at(0)
    const rhs = list.at(1)
    if (lhs.type !== 'fsnumber' || rhs.type !== 'fsnumber') {
      throw new FsException('parameter for "=" must be a number.')
    }
    return lhs.value === rhs.value ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsProcedureLt extends FsSExp {
  static proc (list) {
    return list.at(0).value < list.at(1).value ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsProcedureLte extends FsSExp {
  static proc (list) {
    return list.at(0).value <= list.at(1).value ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsProcedureGt extends FsSExp {
  static proc (list) {
    return list.at(0).value > list.at(1).value ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsProcedureGte extends FsSExp {
  static proc (list) {
    return list.at(0).value >= list.at(1).value ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsAnd extends FsSExp {
  static proc (list) {
    if (list.length === 2) {
      const lhs = list.at(0)
      const rhs = list.at(1)
      return lhs === FsBoolean.TRUE && rhs === FsBoolean.TRUE ? FsBoolean.TRUE : FsBoolean.FALSE
    } else {
      for (let i = 0; i < list.length; i++) {
        if (list.at(0) !== list.at(i)) {
          return FsBoolean.FALSE
        }
      }
      return FsBoolean.TRUE
    }
  }
}

export class FsNot extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    const target = list.at(0)
    if (target instanceof FsBoolean) {
      return target.value ? FsBoolean.FALSE : FsBoolean.TRUE
    } else {
      return FsBoolean.FALSE
    }
  }
}

export class FsProcedureVector extends FsSExp {
  static proc (list) {
    return new FsVector(list.value)
  }
}

export class FsProcedureMap extends FsSExp {
  static proc (list, env) {
    const p = list.at(0)
    const body = list.at(1)
    const ret = []
    for (let i = 0; i < body.length; i++) {
      ret.push(FsEvaluator.eval(new FsList([p, body.at(i)]), env))
    }
    return new FsList(ret)
  }
}

export class FsProcedureMax extends FsSExp {
  static proc (list) {
    const target = list.value.map(fsn => fsn.value)
    return new FsNumber(Math.max(...target))
  }
}

export class FsProcedureMin extends FsSExp {
  static proc (list) {
    const target = list.value.map(fsn => fsn.value)
    return new FsNumber(Math.min(...target))
  }
}

export class FsProcedureAppend extends FsSExp {
  static proc (list) {
    const newList = []
    for (let j = 0; j < list.length; j++) {
      for (let i = 0; i < list.at(j).length; i++) {
        newList.push(list.at(j).at(i))
      }
    }
    return new FsList(newList)
  }
}

export class FsProcedureSetCdr extends FsSExp {
  static proc (list, env) {
    const evaledCurrent = FsEvaluator.eval(list.at(0), env)
    if (evaledCurrent instanceof FsPair) {
      const np = new FsPair(evaledCurrent.car, list.at(1))
      env.set(list.at(0), np)
    } else if (evaledCurrent instanceof FsList) {
      const np = new FsPair(evaledCurrent.at(0), list.at(1))
      env.set(list.at(0), np)
    }
    // const target = list.at(0)
    // const newCdr = list.at(1)
    // target.value.at(0), newCdr
    return FsUndefined.UNDEFINED
  }
}

export class FsWrite extends FsSExp {
  static proc (list) {
    process.stdout.write(list.value.map(s => s.value).join(' '))
    return FsUndefined.UNDEFINED
  }
}

export class FsNewline extends FsSExp {
  static proc (list) {
    console.log()
    return FsUndefined.UNDEFINED
  }
}

// returns memory usage of called time.
//
// only works with Node
export class FsPeekMemoryUsage extends FsSExp {
  static proc (list) {
    const m = process.memoryUsage()
    return new FsString(JSON.stringify(m))
  }
}

// print s-exp in list. For FsString, print its value without double quotes.
export class FsDisplay extends FsSExp {
  static proc (list) {
    process.stdout.write(list.value.map(s => (s instanceof FsString ? s.value : s.toString())).join(' '))
    return FsUndefined.UNDEFINED
  }
}

export class FsValue {}

export class FsList extends FsValue {
  static EMPTY = Object.freeze(new FsList([]))
  constructor (value = []) {
    super()
    this.value = value
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('ctor FsList called with:' + JSON.stringify(value, null, 2))
    }
  }

  get type () {
    return 'fslist'
  }

  push (s) {
    this.value.push(s)
  }

  slice (index) {
    return new FsList(this.value.slice(index))
  }

  get length () {
    return this.value.length
  }

  at (index) {
    return this.value[index]
  }

  static proc (arg) {
    return arg.length === 0 ? FsList.EMPTY : new FsList(arg.value)
  }

  static isEmptyList (arg) {
    return (arg instanceof FsList) && arg.length === 0
  }

  toString () {
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('FsList.toString() called. this.value:' + JSON.stringify(this.value, null, 2))
    }
    if (FsSymbol.SINGLE_QUOTE.equals(this.value[0])) {
      log.debug('PRINTING AS SINGLE_QUOTE')
      return '\'' + this.value[1].toString()
    } else {
      // TODO: this is not optimal, but pass sample code in R5RS
      log.debug('PRINTING AS LIST')
      // return '(' + this.value.map(v => v.toString()).join(' ') + ')'
      let buf = ''
      buf += '('
      for (let i = 0; i < this.value.length; i++) {
        if (!Array.isArray(this.value[i])) {
          buf += this.value[i].toString()
          log.debug(buf)
          buf += ' '
        } else {
          buf += '('
          for (let j = 0; j < this.value[i].length; j++) {
            buf += this.value[i][j]
            buf += ' '
          }
          if (this.value[i].length > 0) {
            buf = buf.substr(0, buf.length - 1)
          }
          buf += ')'
          buf += ' '
        }
      }
      if (this.value.length > 0) {
        buf = buf.substr(0, buf.length - 1)
      }
      buf += ')'
      return buf
    }
  }
}

export class FsVector extends FsSExp {
  /**
   *
   * @param {*} arg Array
   */
  constructor (arg) {
    super()
    this.value = arg
  }

  toString () {
    return '#(' + this.value.map(s => s.toString()).join(' ') + ')'
  }
}

export class FsPair extends FsList {
  constructor (car, cdr) {
    super()
    this.car = car
    this.cdr = cdr
  }

  toString () {
    return '(' + this.car + ' . ' + this.cdr + ')'
  }
}

export class FsCar extends FsSExp {
  static proc (arg) {
    const target = arg.at(0)
    if (target instanceof FsPair) {
      return target.car
    } else if (target instanceof FsList) {
      if (target === FsList.EMPTY) {
        throw new FsException('Syntax Error : cannot call car with EMPTY list')
      }
      return target.at(0)
    } else {
      throw new FsException('Syntax Error : cannot call car with arg ' + arg)
    }
  }
}

export class FsCdr extends FsSExp {
  static proc (arg) {
    const target = arg.at(0)
    if (target instanceof FsPair) {
      return target.cdr
    } else if (target instanceof FsList) {
      if (target === FsList.EMPTY) {
        throw new FsException('Syntax Error : cannot call cdr with EMPTY list')
      }
      return new FsList(target.value.slice(1))
    } else {
      throw new FsException('Syntax Error : cannot call cdr with arg ' + arg)
    }
  }
}

export class FsCons extends FsSExp {
  static proc (arg) {
    ensureListContainsTwo(arg)
    // TODO dot pair
    if (arg.at(1) instanceof FsList) {
      return new FsList([arg.at(0)].concat(arg.at(1).value))
    } else {
      return new FsPair(arg.at(0), arg.at(1))
    }
  }
}

export class FsPredicateNull extends FsSExp {
  static proc (list) {
    return list.at(0) instanceof FsList && (list.at(0)).length === 0 ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsPredicateBoolean extends FsSExp {
  static proc (list) {
    return list.at(0) instanceof FsBoolean ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsPredicateList extends FsSExp {
  static proc (list) {
    return list.at(0) instanceof FsList ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsPredicateNumber extends FsSExp {
  static proc (list) {
    return list.at(0) instanceof FsNumber ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsPredicateSymbol extends FsSExp {
  static proc (list, env) {
    return (list.at(0) instanceof FsSymbol)
      ? FsBoolean.TRUE
      : FsBoolean.FALSE
  }
}

export class FsPredicateProcedure extends FsSExp {
  static proc (list) {
    return list.at(0) instanceof FsDefinedProcedure ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsPredicatePair extends FsSExp {
  static proc (list) {
    return list.at(0) instanceof FsPair ||
    (list.at(0) instanceof FsList && !FsList.isEmptyList(list.at(0)))
      ? FsBoolean.TRUE
      : FsBoolean.FALSE
  }
}

export class FsPredicateVector extends FsSExp {
  static proc (list) {
    return list.at(0) instanceof FsVector
      ? FsBoolean.TRUE
      : FsBoolean.FALSE
  }
}
