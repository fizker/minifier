#!/usr/bin/env node

var path = require('path')
  , input = path.join(__dirname, 'test/manual/css/a.css')
  , output = path.join(__dirname, 'test/manual/min.css')

process.argv.splice(2,0, input, '--output', output)

require('./index')
