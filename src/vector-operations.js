import { FsException } from './common.js'
import * as datatypesJs from './datatypes.js'
import { FsSExp } from './sexpbase.js'

export class FspVector extends FsSExp {
  static proc (list) {
    return new datatypesJs.FsVector(list.value)
  }
}

export class FspVectorRef extends FsSExp {
  static proc (list) {
    const vec = list.at(0)
    if (!(vec instanceof datatypesJs.FsVector)) {
      throw new FsException('a vector is required')
    }
    const index = list.at(1).value
    return list.at(0).at(index)
  }
}
