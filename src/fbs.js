'use strict'

import FS from 'fs'

import log from 'loglevel'
import { FizzBuzzScheme } from './index.js'
log.setLevel('info')

// argv[0] -> path of node.exe
// argv[1] -> path of this script
if (process.argv.length <= 2) {
  console.log('usage: node fbs.js {file}')
  process.exit(0)
}
const engine = new FizzBuzzScheme()
for (let i = 2; i < process.argv.length; i++) {
  log.debug('executing:' + process.argv[i])
  const file = process.argv[i]
  const data = FS.readFileSync(file, 'utf8')
  engine.eval(data)
}
