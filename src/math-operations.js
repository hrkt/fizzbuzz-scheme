import { FsException } from './common.js'
import { FsBoolean, FsNumber } from './datatypes.js'
import { FsSExp } from './sexpbase.js'
import { ensureListContainsTwo } from './sexputils.js'

// operators

export class FslpAbs extends FsSExp {
  static proc (list) {
    if (!(list.at(0) instanceof FsNumber)) {
      throw new FsException('arg must be number')
    }
    return new FsNumber(Math.abs(list.at(0).value))
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

export class FspMod extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    const dividend = list.at(0).value
    const divisor = list.at(1).value
    return new FsNumber(dividend % divisor)
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

export class FspNumberEquals extends FsSExp {
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

export class FspPow extends FsSExp {
  static proc (list) {
    ensureListContainsTwo(list)
    return new FsNumber(Math.pow(list.at(0).value, list.at(1).value))
  }
}

export class FspRound extends FsSExp {
  static proc (list) {
    return new FsNumber(Math.round(list.at(0).value))
  }
}

export class FspSqrt extends FsSExp {
  static proc (list) {
    return Math.sqrt(list.value)
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
    return new FsNumber(Math.max(...target))
  }
}

export class FspMin extends FsSExp {
  static proc (list) {
    const target = list.value.map(fsn => fsn.value)
    return new FsNumber(Math.min(...target))
  }
}
