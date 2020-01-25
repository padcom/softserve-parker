#!/usr/bin/env node-ts

import 'reflect-metadata'
import './app/polyfills'
import { engine } from './app/engine'

async function main () {
  await engine()
  console.log('Done')
}

main().then(() => process.exit(0))
