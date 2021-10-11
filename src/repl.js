// REPL tool
'use strict'
import FS from 'fs'
import log from 'loglevel'
import PromptSync from 'prompt-sync'

import { FizzBuzzScheme as FBS } from '../src/index.js'

log.setLevel('info')

const promptSync = PromptSync({ sigint: true })

// load samples, ignoring the files that contain ';SAMPLE_IGNORE' comment
function loadSamples (fbs) {
  try {
    FS.readdirSync('sample').forEach(file => {
      const data = FS.readFileSync('sample/' + file, 'utf8')
      log.debug('read:' + data)
      if (!data.includes(';SAMPLE_IGNORE')) {
        fbs.eval(data)
      } else {
        log.debug('ignored:' + file)
      }
    })
  } catch (err) {
    console.error(err)
  }
}

let loop = true
let fbs = new FBS()
while (loop) {
  const exp = promptSync('fbs> ')
  if (exp === '') {
    // do nothing
  } else if (exp === 'clear') {
    fbs = new FBS()
  } else if (exp === 'samples') {
    loadSamples(fbs)
  } else if (exp === 'd') {
    fbs.enableDebugMode()
    // fbs.eval('(define fib (lambda (n) (if (< n 2) n (+ (fib (- n 2)) (fib (- n 1))))))')
  } else if (exp === 'q') {
    console.log('bye.')
    loop = false
  } else {
    try {
      const res = fbs.eval(exp)
      console.log(res.toString())
    } catch (e) {
      console.log(e)
    }
  }
}
