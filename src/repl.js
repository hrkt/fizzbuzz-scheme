// REPL tool
'use strict'
import FS from 'fs'
import PromptSync from 'prompt-sync'
import log from 'loglevel'

import { FsParser as FP } from './parser.js'
import { FsEvaluator as FE } from './evaluator.js'
import { getGlobalEnv } from './env.js'

log.setLevel('info')

const promptSync = PromptSync({ sigint: true })

function loadSample () {
  try {
    const data = FS.readFileSync('sample/fizzbuzz.fbs', 'utf8')
    console.log('read:' + data)
    const exp = data
    FE.eval(FP.parse(exp), env)
  } catch (err) {
    console.error(err)
  }
}

let loop = true
let env = getGlobalEnv()
while (loop) {
  const exp = promptSync('fbs>')
  if (exp === 'clear') {
    env = getGlobalEnv()
  } if (exp === 'sample') {
    loadSample()
  } else if (exp === 'q') {
    console.log('bye.')
    loop = false
  } else {
    const res = FE.eval(FP.parse(exp), env).toString()
    console.log(res.toString())
  }
}
