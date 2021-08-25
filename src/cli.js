'use strict'

import FS from 'fs'

import log from 'loglevel'
import { FizzBuzzScheme } from './index.js'
log.setLevel('info')

export class FsCli {
  static main (argv) {
    // argv[0] -> path of node.exe
    // argv[1] -> path of this script
    log.info('args: ' + argv)
    if (argv.length <= 2) {
      console.log('usage: node fbs.js {file}')
      process.exit(0)
    } else {
      const engine = new FizzBuzzScheme()
      for (let i = 2; i < argv.length; i++) {
        log.debug('executing:' + argv[i])
        const file = argv[i]
        const data = FS.readFileSync(file, 'utf8')
        engine.eval(data)
      }
    }
  }
}
