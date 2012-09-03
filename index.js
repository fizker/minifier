#!/usr/bin/env node

var program = require('commander')
  , minifier = require('./src/minify')
  , input

if(require.main === module) {
	program
		.version('0.4.0')
		.option('-o, --output [file]', 'The output file')
		.option('-t, --template [template]', 'A template for building the output file')
		.option('-c, --clean', 'Deletes any files that resembles the template')
		.usage('[--output file] path/to/input')
		.parse(process.argv)

	input = program.args[0]

	if(!input) {
		program.parse(['bla', 'bla', '--help'])
		process.exit()
	}

	minifier.on('error', function(msg) {
		console.log(msg)
		process.exit(1)
	})
	minifier.minify(input, program)

	console.log('Minification complete')
}

module.exports = minifier
