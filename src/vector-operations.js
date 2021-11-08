import { FsException } from './common.js'
import { FsInteger, FsNumber, FsVector } from './datatypes.js'
import { FsUndefined } from './sexp.js'
import { FsSExp } from './sexpbase.js'

export class FspMakeVector extends FsSExp {
  static proc (list) {
    const length = list.at(0)
    if (!(length instanceof FsInteger)) {
      throw new FsException('a number is required:' + length)
    }
    const fill = list.length === 2 ? list.at(1) : FsUndefined.UNDEFINED
    const buf = []
    for (let i = 0; i < length.value; i++) {
      buf[i] = fill
    }
    return new FsVector(buf)
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

export class FspVectorSet extends FsSExp {
  static proc (list, env) {
    const vec = list.at(0)
    if (!(vec instanceof FsVector)) {
      throw new FsException('a vector is required while arg is ' + list.at(0))
    }
    if (!vec.isMutable) {
      throw new FsException('a vector constant is immutable' + list.at(0))
    }
    const index = list.at(1)
    if (!(index instanceof FsInteger)) {
      throw new FsException('a number is required while arg is ' + list.at(1))
    }
    const obj = list.at(2)
    vec.value[index.value] = obj
    // return value is unspecified by spec
    return FsUndefined.UNDEFINED
  }
}
