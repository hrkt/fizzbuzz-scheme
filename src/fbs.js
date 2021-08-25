'use strict'

import log from 'loglevel'
import { FsCli } from './cli.js'
log.setLevel('info')

FsCli.main(process.argv)
