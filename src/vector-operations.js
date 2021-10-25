import { FsException } from './common.js'
import { FsNumber, FsVector } from './datatypes.js'
import { FsUndefined } from './sexp.js'
import { FsSExp } from './sexpbase.js'

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
    const index = list.at(1)
    if (!(index instanceof FsNumber)) {
      throw new FsException('a number is required while arg is ' + list.at(1))
    }
    const obj = list.at(2)
    vec.value[index.value] = obj
    // return value is unspecified by spec
    return FsUndefined.UNDEFINED
  }
}
