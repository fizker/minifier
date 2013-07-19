#!/usr/bin/env node

var path = require('path')
var input = path.join(__dirname, 'test/manual/css/a.css')
var output = path.join(__dirname, 'test/manual/min.css')

var minifier = require('./index')
minifier.minify(input, { output: output })

console.log('The manual test is complete')
