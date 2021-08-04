// various S-expressions
'use strict'

import { FsEvaluator } from './evaluator.js'
import log from 'loglevel'
import { FsEnv } from './env.js'
import { FsException } from './common.js'

export class SExpFactory {
  static build (s) {
    if (!isNaN(s)) {
      return new FsNumber(+s)
    } else if (FsBoolean.isFsBooleanString(s)) {
      return FsBoolean.fromString(s)
    } else {
      return new FsSymbol(s)
    }
  }
}

export class FsSExp {
  constructor (value = null) {
    if (this.constructor === FsSExp) {
      throw new FsException('FsSexp class can\'t be instantiated.')
    }
  }
}

export class FsAtom extends FsSExp {
  constructor (value = null) {
    super()
    if (this.constructor === FsAtom) {
      throw new FsException('FsAtom class can\'t be instantiated.')
    }
    this._value = value
  }

  get value () {
    return this._value
  }

  set value (v) {
    this._value = v
  }

  toString () {
    return this._value === null ? 'null' : this._value.toString()
  }
}

export class FsList extends FsSExp {
  constructor (list = []) {
    super()
    this.value = list
  }

  get length () {
    return this.value.length
  }

  toString () {
    log.debug(this.value)
    return '(' + this.value.map(v => FsEvaluator.eval(v)).join(' ') + ')'
  }
}

export class FsIf extends FsList {
  static proc (list, env) {
    log.debug('fsIf')
    log.debug(list)
    const [test, conseq, alt] = list
    if (FsEvaluator.eval(test, env).value) {
      return FsEvaluator.eval(conseq, env)
    } else {
      return FsEvaluator.eval(alt, env)
    }
  }
}

export class FsLambda extends FsList {
  static proc (list, env) {
    const car = list.shift()
    const cdr = list.shift()
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('exec lambda with car:' + car + ',cdr:' + cdr)
      log.debug('--car--')
      log.debug(car)
      log.debug('--car--')
      log.debug(cdr)
      log.debug('------')
    }

    if (!Array.isArray(car)) {
      // single variable not suppoted
      throw new Error('non-arry type arg is not implemented')
    }
    // car is a variable symbol in this closure
    const innerEnv = new FsEnv(env)

    const f = (x) => {
      log.debug('executing f with param:' + x)

      if (!Array.isArray(x)) {
        throw new Error('arg type do not match')
      }
      for (let i = 0; i < car.length; i++) {
        innerEnv.set(car[i], x[i])
      }

      if (log.getLevel() <= log.levels.DEBUG) {
        log.debug('outer env:' + env.toString())
        log.debug('inner env:' + innerEnv.toString())
        log.debug('executing eval parsed:' + cdr + ' in env:' + innerEnv.toString())
        console.dir(cdr)
      }
      return FsEvaluator.eval(cdr, innerEnv)
    }
    return f
  }
}

export class FsDefine extends FsList {
  static proc (list, env) {
    if (!Array.isArray(list)) {
      throw new Error('arg is not List')
    } else if (list.length !== 2) {
      throw new Error('length of arg for define is not 2 ')
    }
    const car = list.shift()
    const cdr = list.shift()

    log.debug('car:' + car + ',cdr:' + cdr)
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('DUMP-IN-DEFINE')
      console.dir(cdr)
    }

    if (!Array.isArray(car)) {
      env.set(car, FsEvaluator.eval(cdr, env))
      return car
    } else {
      throw new Error('not implemented')
    }
  }
}

export class FsQuote extends FsList {
  static proc (arg) {
    console.debug('arg.length = ' + arg.length)
    if (!Array.isArray(arg[0])) {
      return arg
    } else {
      return new FsList(arg[0])
    }
  }
}

export class FsBoolean extends FsAtom {
  static TRUE_ = new FsBoolean(true)
  static FALSE_ = new FsBoolean(false)

  static get TRUE () { return FsBoolean.TRUE_ }
  static get FALSE () { return FsBoolean.FALSE_ }

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

  static fromValue (v) {
    return v ? FsBoolean.TRUE : FsBoolean.FALSE
  }

  toString () {
    return this.value ? '#t' : '#f'
  }
}

export class FsNumber extends FsAtom {}

export class FsString extends FsAtom {}

export class FsSymbol extends FsAtom {}

function ensureListContainsTwo (list) {
  if (!Array.isArray(list) || list.length !== 2) {
    throw new Error('mod must take 2 arguments as list')
  }
}

export class FsOperatorPlus extends FsList {
  static proc (list) {
    return new FsNumber(list.map(n => n.value).reduce((a, b) => a + b, 0))
  }
}

export class FsOperatorMod extends FsList {
  static proc (list) {
    ensureListContainsTwo(list)
    const dividend = list[0].value
    const divisor = list[1].value
    return new FsNumber(dividend % divisor)
  }
}

export class FsEquals extends FsList {
  static proc (param, env) {
    if (log.getLevel() <= log.levels.DEBUG) {
      log.debug('FsEquals')
      console.dir(param)
    }
    if (!Array.isArray(param) || param.length !== 2) {
      throw new Error('equals must take 2 arguments as list')
    }
    const [lhs, rhs] = param
    return FsEvaluator.eval(lhs, env).toString() === FsEvaluator.eval(rhs, env).toString() ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FsAnd extends FsList {
  static proc (list, env) {
    ensureListContainsTwo(list)
    const [lhs, rhs] = list
    return FsEvaluator.eval(lhs, env).value === true && FsEvaluator.eval(rhs, env).value === true ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}
