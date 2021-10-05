#!/usr/bin/env node
'use strict'

import log from 'loglevel'

import { FsCli } from '../src/cli.js'
log.setLevel('info')

FsCli.main(process.argv)
