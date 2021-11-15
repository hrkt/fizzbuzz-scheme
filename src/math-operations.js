import { FsException } from './common.js'
import { FsBoolean, FsInteger, FsNumber, FsRational, FsReal, gcd, lcm } from './datatypes.js'
import { FsSExp } from './sexpbase.js'
import { ensureListContainsOne, ensureListContainsTwo } from './sexputils.js'

// functions of various math-algorithms

// find rational number representation by "Stern-Brocot Tree"
export function findRationalReps (realValue, epsilon = 0.0001) {
  let a = 0
  let b = 1
  let c = 1
  let d = 0
  let bestError = realValue
  let numerator = 0
  let denominator = 1
  while (bestError > epsilon) {
    const mid = (a + c) / (b + d)

    if (bestError > Math.abs(realValue - mid)) {
      bestError = Math.abs(realValue - mid)
      numerator = a + c
      denominator = b + d
    }

    if (realValue < mid) {
      [c, d] = [a + c, b + d]
    } else {
      [a, b] = [a + c, b + d]
    }
  }
  return new FsRational(numerator, denominator)
}

// internal functions

function checkArgRepresentsAnInteger (n) {
  if (!(n instanceof FsInteger || (n instanceof FsReal && n.isInteger()))) {
    throw new FsException('arg must be an integer ' + n)
  }
}

/**
 * an util function that takes 1 parameter and applyes a given function
 *
 * @param {*} JavaScript function
 * @param {*} a FsInteger, FsRational or FsReal
 * @returns {any} FsInteger or FsReal
 */
// used by ceil, floor, truncate, round
function realParamWithIntReturnUnaryOperation (func, a) {
  if (a instanceof FsInteger || a instanceof FsRational) {
    return new FsInteger(func(a.value))
  } else {
    if (!(a instanceof FsReal)) {
      throw new FsException('arg must be a real or integer value but got ' + a)
    }
    return new FsReal(func(a.value))
  }
}

function realParameterBinaryOperation (func, a, b) {
  if (a instanceof FsInteger && b instanceof FsInteger) {
    return new FsInteger(func(a.value, b.value))
  } else {
    // TODO: remove FsNumber after adding datatype oeprations.
    if (!(a instanceof FsReal || a instanceof FsInteger || a instanceof FsNumber)) {
      throw new FsException('arg must be an integer but got ' + a)
    }
    // TODO: remove FsNumber after adding datatype oeprations.
    if (!(b instanceof FsReal || b instanceof FsInteger || b instanceof FsNumber)) {
      throw new FsException('arg must be an integer but got ' + b)
    }
    return new FsReal(func(a.value, b.value))
  }
}

// exported operators

export class FslpAbs extends FsSExp {
  static proc (list) {
    if (list.at(0) instanceof FsInteger) {
      return new FsInteger(Math.abs(list.at(0).value))
    } else if (list.at(0) instanceof FsNumber) {
      return new FsNumber(Math.abs(list.at(0).value))
    }
    throw new FsException('arg must be number')
  }
}

export class FspCeiling extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    const t = list.at(0)
    return realParamWithIntReturnUnaryOperation(Math.ceil, t)
  }
}

export class FspDenominator extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    const n1 = list.at(0)
    if (n1 instanceof FsRational) {
      return new FsInteger(n1.denominator)
    } else {
      // return n1.value
      return new FsReal(findRationalReps(n1).denominator)
    }
  }
}

export class FspDivide extends FsSExp {
  static proc (list) {
    if (list.length === 1) {
      // TODO: support rational number
      if (list.at(0).value !== 0) {
        if (list.at(0) instanceof FsInteger) {
          return list.at(0).value === 1 ? new FsInteger(1) : new FsRational(1, list.at(0).value).canonicalForm()
        } else {
          return new FsReal(1.0 / list.at(0).value)
        }
      } else {
        throw new FsException('divide by 0')
      }
    } else {
      const divisor = FspMultiply.proc(list.slice(1))

      if (divisor.value !== 0) {
        if (list.at(0) instanceof FsInteger && divisor instanceof FsInteger) {
          if (list.at(0).value % divisor.value === 0) {
            return new FsInteger(list.at(0) % divisor.value === 0)
          } else {
            return new FsRational(list.at(0).value, divisor.value).canonicalForm()
          }
        } else {
          return new FsReal(list.at(0).value / divisor.value)
        }
      } else {
        throw new FsException('divide by 0')
      }
    }
  }
}

export class FspExactToInexact extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    const t = list.at(0)
    if (t instanceof FsInteger) {
      return new FsReal(t)
    } else if (t instanceof FsReal) {
      return new FsReal(t)
    } else if (t instanceof FsRational) {
      return t.asReal()
    } else {
      throw new FsException('not supported yet.')
    }
  }
}

export class FspFloor extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    const t = list.at(0)
    return realParamWithIntReturnUnaryOperation(Math.floor, t)
  }
}
export class FspGcd extends FsSExp {
  static proc (list) {
    if (list.length === 0) {
      return new FsInteger(0)
    }
    ensureListContainsTwo(list)
    return realParameterBinaryOperation(gcd, list.at(0), list.at(1))
  }
}

export class FspLcm extends FsSExp {
  static proc (list) {
    if (list.length === 0) {
      return new FsInteger(1)
    }
    ensureListContainsTwo(list)
    return realParameterBinaryOperation(lcm, list.at(0), list.at(1))
  }
}

export class FspMinus extends FsSExp {
  static proc (list) {
    if (list.length === 2) {
      if (list.at(0) instanceof FsInteger && list.at(1) instanceof FsInteger) {
        return new FsInteger(list.at(0).value - list.at(1).value)
      } else {
        return new FsNumber(list.at(0).value - list.at(1).value)
      }
    } else if (list.length === 1) {
      if (list.at(0) instanceof FsInteger) {
        return new FsInteger(-1 * (list.at(0).value))
      } else {
        return new FsNumber(-1 * (list.at(0).value))
      }
    } else {
      // for the readability, use this line
      // return new FsNumber(list.at(0).value - FspPlus.proc(list.slice(1)))

      // for the performance, use lines below. it may be bit faster.
      //
      let onlyIntegers = true
      let buf = list.at(0).value
      for (let i = 1; i < list.length; i++) {
        buf -= list.at(i)
        if (!(list.at(i) instanceof FsInteger)) {
          onlyIntegers = false
        }
      }
      if (onlyIntegers) {
        return new FsInteger(buf)
      } else {
        return new FsNumber(buf)
      }
    }
  }
}

export class FspMod extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const dividend = list.at(0).value
    const divisor = list.at(1).value
    return new FsInteger(dividend % divisor)
  }
}

export class FspModulo extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const n1 = list.at(0)
    checkArgRepresentsAnInteger(n1)
    const n2 = list.at(1)
    checkArgRepresentsAnInteger(n2)
    const v = ((n1.value % n2.value) + n2.value) % n2.value
    if (n1 instanceof FsInteger && n2 instanceof FsInteger) {
      return new FsInteger(v)
    } else {
      return new FsReal(v)
    }
  }
}

export class FspMultiply extends FsSExp {
  static proc (list) {
    if (list.length === 0) {
      return new FsInteger(1)
    }
    // return new FsNumber(list.map(n => n.value).reduce((a, b) => a * b, 1))
    let onlyIntegers = list.at(0) instanceof FsInteger
    let buf = list.at(0).value

    for (let i = 1; i < list.length; i++) {
      buf *= list.at(i).value
      if (!(list.at(i) instanceof FsInteger)) {
        onlyIntegers = false
      }
    }
    if (onlyIntegers) {
      return new FsInteger(buf)
    } else {
      return new FsNumber(buf)
    }
  }
}

export class FspNumberEquals extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const lhs = list.at(0)
    const rhs = list.at(1)
    // if (lhs.type !== 'fsnumber' || rhs.type !== 'fsnumber') {
    //   throw new FsException('parameter for "=" must be a number.')
    // }
    if (!(lhs instanceof FsInteger || lhs instanceof FsNumber)) {
      throw new FsException('parameter for "=" must be a number.')
    }
    if (!(rhs instanceof FsInteger || rhs instanceof FsNumber)) {
      throw new FsException('parameter for "=" must be a number.')
    }
    return lhs.value === rhs.value ? FsBoolean.TRUE : FsBoolean.FALSE
  }
}

export class FspNumerator extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    const n1 = list.at(0)
    if (n1 instanceof FsRational) {
      return n1.numerator
    } else {
      return n1.value
    }
  }
}
export class FspPlus extends FsSExp {
  static proc (list) {
    // for the readability, use this line
    // return new FsNumber(list.map(n => n.value).reduce((a, b) => a + b, 0))

    // for the performance, use lines below. it may be bit faster.
    //
    if (list.length === 2) {
      if (list.at(0) instanceof FsInteger && list.at(1) instanceof FsInteger) {
        return new FsInteger(list.at(0).value + list.at(1).value)
      } else {
        return new FsNumber(list.at(0).value + list.at(1).value)
      }
    } else if (list.length === 1) {
      return new FsNumber(list.at(0).value)
    } else {
      let onlyIntegers = true
      let buf = 0
      for (let i = 0; i < list.length; i++) {
        buf += list.at(i).value
        if (!(list.at(i) instanceof FsInteger)) {
          onlyIntegers = false
        }
      }
      if (onlyIntegers) {
        return new FsInteger(buf)
      } else {
        return new FsNumber(buf)
      }
    }
  }
}

export class FspPow extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    if (list.at(0) instanceof FsInteger && list.at(1) instanceof FsInteger) {
      return new FsInteger(Math.pow(list.at(0).value, list.at(1).value))
    } else {
      return new FsNumber(Math.pow(list.at(0).value, list.at(1).value))
    }
  }
}

export class FspQuotient extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const n1 = list.at(0)
    checkArgRepresentsAnInteger(n1)
    const n2 = list.at(1)
    checkArgRepresentsAnInteger(n2)
    const v = parseInt(n1.value / n2.value)
    if (n1 instanceof FsInteger && n2 instanceof FsInteger) {
      return new FsInteger(v)
    } else {
      return new FsReal(v)
    }
  }
}

export class FspReminder extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const n1 = list.at(0)
    checkArgRepresentsAnInteger(n1)
    const n2 = list.at(1)
    checkArgRepresentsAnInteger(n2)
    const v = n1.value - parseInt(n1.value / n2.value) * n2.value
    if (n1 instanceof FsInteger && n2 instanceof FsInteger) {
      return new FsInteger(v)
    } else {
      return new FsReal(v)
    }
  }
}

export class FspRound extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    const t = list.at(0)
    return realParamWithIntReturnUnaryOperation(Math.round, t)
  }
}
export class FspSqrt extends FsSExp {
  static proc (list) {
    return Math.sqrt(list.value)
  }
}

export class FspTruncate extends FsSExp {
  static proc (list) {
    ensureListContainsOne(list)
    const t = list.at(0)
    return realParamWithIntReturnUnaryOperation(Math.trunc, t)
  }
}

// comparison

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

// aggregation

export class FspMax extends FsSExp {
  static proc (list) {
    const target = list.value.map(fsn => fsn.value)
    if (list.length === list.value.filter(l => { return l instanceof FsInteger }).length) {
      return new FsInteger(Math.max(...target))
    } else {
      return new FsReal(Math.max(...target))
    }
  }
}

export class FspMin extends FsSExp {
  static proc (list) {
    const target = list.value.map(fsn => fsn.value)
    if (list.length === list.value.filter(l => { return l instanceof FsInteger }).length) {
      return new FsInteger(Math.min(...target))
    } else {
      return new FsReal(Math.min(...target))
    }
  }
}
