#!/usr/bin/env node-ts

import 'reflect-metadata'
import './app/polyfills'
import { engine, createRandomReservationRequests } from './app/engine'

async function main () {
  if (process.argv.includes('--test')) {
    // TESTING: create a set of random requests
    await createRandomReservationRequests(new Date())
  }

  await engine()
  console.log('Done')
}

main().then(() => process.exit(0))
