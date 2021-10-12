// various S-expressions
'use strict'

import FS from 'fs'
import log from 'loglevel'

import { FsAdjuster } from './adjuster.js'
import { FsError, FsException } from './common.js'
import { FsBoolean, FsList, FsNumber, FsPair, FsString, FsVector } from './datatypes.js'
import { FsEnv } from './env.js'
import { FsEvaluator } from './evaluator.js'
import { FsParser } from './parser.js'
import { FsAtom, FsSExp } from './sexpbase.js'
import { ensureListContainsOne, ensureListContainsTwo } from './sexputils.js'
import { FsSymbol } from './symbol.js'

export class FsIf extends FsSExp {
  /**
   * @deprecated since version 0.1.6, this function is inlined to eval-loop
   */
  static proc (list, env) {
    throw new FsError('do not call me.')
  }
}

export class FsLambda extends FsSExp {
  static proc (list, env) {
    const params = list.at(0)

    // (lambda <formals> body)
    // <formals> could be 3 types.
    // case 1. (<v1> <v2>, ...) ; a fixed number of arguments
    // case 2. <v> ; any number of arguments
    // case 3. (<v1> <v2> ... <vn> . <vn+1>) ; takes n or more arguments

    const body = list.slice(1)
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

    if (!(car instanceof FsList)) {
      // e.g.
      // (define x1 (lambda (x) (* x 2)))
      const cdr = list.at(1)
      env.set(car, FsEvaluator.eval(cdr, env))
      if (log.getLevel() <= log.levels.DEBUG) {
        log.debug('define symbol - symbol:' + car + ' value:' + cdr)
      }
      return car
    } else {
      // e.g.
      // (define (x2 x) (* x 2))
      const funcName = car.at(0)
      const params = car.slice(1)
      const cdr = list.slice(1)
      const body = cdr
      const procedure = new FsDefinedProcedure(params, body, env)
      if (log.getLevel() <= log.levels.DEBUG) {
        log.debug('define functiton - funcName:' + funcName + ' procedure:' + procedure)
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
        log.debug('set! - prev:' + prev + ' new:' + newValue)
      }
      const v = FsEvaluator.eval(newValue, env)
      env.set(symbol, v)
      return v
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

export class FsUndefined extends FsAtom {
  static UNDEFINED_ = new FsUndefined()

  static get UNDEFINED () { return FsUndefined.UNDEFINED_ }

  toString () {
    return '#undefined'
  }
}

export class FspAbs extends FsSExp {
  static proc (list) {
    if (!(list.at(0) instanceof FsNumber)) {
      throw new FsException('arg must be number')
    }
    return new FsNumber(Math.abs(list.at(0).value))
  }
}

export class FspPlus extends FsSExp {
  static proc (list) {
    // for the readability, use this line
    // return new FsNumber(list.map(n => n.value).reduce((a, b) => a + b, 0))

    // for the performance, use lines below. it may be bit faster.
    //
    if (list.length === 2) {
      return new FsNumber(list.at(0).value + list.at(1).value)
    } else if (list.length === 1) {
      return new FsNumber(list.at(0).value)
    } else {
      let buf = 0
      for (let i = 0; i < list.length; i++) {
        buf += list.at(i).value
      }
      return new FsNumber(buf)
    }
  }
}

export class FspRound extends FsSExp {
  static proc (list) {
    return new FsNumber(Math.round(list.at(0).value))
  }
}

export class FspMultiply extends FsSExp {
  static proc (list) {
    if (list.length === 0) {
      return new FsNumber(1)
    }
    // return new FsNumber(list.map(n => n.value).reduce((a, b) => a * b, 1))
    let buf = list.at(0).value
    for (let i = 1; i < list.length; i++) {
      buf *= list.at(i).value
    }
    return new FsNumber(buf)
  }
}

export class FspMinus extends FsSExp {
  static proc (list) {
    if (list.length === 2) {
      return new FsNumber(list.at(0).value - list.at(1).value)
    } else if (list.length === 1) {
      return new FsNumber(-1 * (list.at(0).value))
    } else {
      // for the readability, use this line
      // return new FsNumber(list.at(0).value - FspPlus.proc(list.slice(1)))

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

export class FspDivide extends FsSExp {
  static proc (list) {
    if (list.length === 1) {
      // TODO: support rational number
      if (list.at(0).value !== 0) {
        return new FsNumber(list.at(0).value)
      } else {
        throw new FsException('divide by 0')
      }
    } else {
      const divisor = FspMultiply.proc(list.slice(1))
      if (divisor.value !== 0) {
        return new FsNumber(list.at(0).value / divisor.value)
      } else {
        throw new FsException('divide by 0')
      }
    }
  }
}

export class FspMod extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const dividend = list.at(0).value
    const divisor = list.at(1).value
    return new FsNumber(dividend % divisor)
  }
}

export class FspPow extends FsSExp {
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

export class FspLt extends FsSExp {
  static proc (list) {
    return list.at(0).value < list.at(1).value ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FspLte extends FsSExp {
  static proc (list) {
    return list.at(0).value <= list.at(1).value ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FspGt extends FsSExp {
  static proc (list) {
    return list.at(0).value > list.at(1).value ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FspGte extends FsSExp {
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

export class FspVector extends FsSExp {
  static proc (list) {
    return new FsVector(list.value)
  }
}

export class FspVectorRef extends FsSExp {
  static proc (list) {
    const vec = list.at(0)
    if (!(vec instanceof FsVector)) {
      throw new FsException('a vector is required')
    }
    const index = list.at(1).value
    return list.at(0).at(index)
  }
}

export class FspMap extends FsSExp {
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

export class FspMax extends FsSExp {
  static proc (list) {
    const target = list.value.map(fsn => fsn.value)
    return new FsNumber(Math.max(...target))
  }
}

export class FspMin extends FsSExp {
  static proc (list) {
    const target = list.value.map(fsn => fsn.value)
    return new FsNumber(Math.min(...target))
  }
}

export class FspAppend extends FsSExp {
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

export class FspSetCdr extends FsSExp {
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

export class FspLastPair extends FsSExp {
  static proc (list, env) {
    if (list.at(0).type === 'fspair') {
      let current = list.at(0)
      let hasMore = current.cdr !== undefined && current.cdr.type === 'fspair'
      while (hasMore) {
        const next = current.cdr
        hasMore = next.cdr !== undefined && next.cdr.type === 'fspair'
        if (hasMore) {
          current = current.at(0).cdr
        } else {
          current = next
        }
      }
      return current
    } else {
      return (list.at(0)).at(list.at(0).length - 1)
    }
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

export class FspLoad extends FsSExp {
  static proc (list, env) {
    // TODO: utilize this in cli.js and index.js
    const file = list.at(0).value
    log.debug('loading ' + file)
    try {
      const data = FS.readFileSync(file, 'utf8')
      const parsed = FsParser.parse(data)
      const adjusted = FsAdjuster.adjust(parsed)
      for (let i = 0; i < adjusted.length; i++) {
        FsEvaluator.eval(adjusted[i], env)
      }
      return FsUndefined.UNDEFINED
    } catch {
      throw new FsException('error in loading file:' + file)
    }
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

export class FsSyntaxQuasiQuote {
  static procInner (arg, env) {
    if (!(arg instanceof FsList)) {
      return arg
    } else {
      // arg is FsList
      const t = arg.at(0)
      if (t === FsSymbol.COMMA || t === FsSymbol.UNQUOTE || t === FsSymbol.COMMA_FOLLOWED_BY_AT) {
        const newEnv = new FsEnv(env)
        newEnv.increaseUnquoteDepth()
        if (newEnv.isSameQuasiquoteAndUnquoteLevel()) {
          // eval and replace
          return FsEvaluator.eval(arg.at(1), newEnv)
        } else {
          // do not eval, preserve unquote
          const buf = []
          buf.push(t)
          buf.push(this.procInner(arg.at(1), newEnv))
          return new FsList(buf)
        }
      } else {
        let nextEnv = null
        if (t === FsSymbol.QUASIQUOTE || t === FsSymbol.BACK_QUOTE) {
          nextEnv = new FsEnv(env)
          env.increaseQuasiquoteDepth()
        } else {
          nextEnv = env
        }

        const buf = []
        for (let i = 0; i < arg.length; i++) {
          const t = arg.at(i)
          if (t instanceof FsList && t.length > 1 && t.at(0) === FsSymbol.COMMA_FOLLOWED_BY_AT) {
            const proced = this.procInner(t, nextEnv)
            buf.push(...proced.value)
          } else {
            buf.push(this.procInner(t, nextEnv))
          }
        }
        return new FsList(buf)
      }
    }
  }

  static proc (arg, env) {
    // when we find "`", increase quote depth
    const quotedEnv = new FsEnv(env)
    quotedEnv.increaseQuasiquoteDepth()
    return this.procInner(arg, quotedEnv)
  }
}
export class FsSyntaxUnquote {
  static proc (arg, env) {
    log.debug('UNQUOTE>>>>>' + arg)
    throw new Error('came here!')
  }
}
