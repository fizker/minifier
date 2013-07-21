#!/usr/bin/env node

var program = require('commander')
var minifier = require('./src/minify')
var input

if(require.main === module) {
	program
		.version(require('./package.json').version)
		.option('-o, --output [file]', 'The output file')
		.option('-t, --template [template]', 'A template for building the output file')
		.option('-c, --clean', 'Deletes any files that resembles the template')
		.option('-C, --clean-only', 'Same as `--clean`, but without minifying the files afterwards.')
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

	if(program.cleanOnly) {
		return console.log('Minified files cleaned')
	}

	console.log('Minification complete')
}

module.exports = minifier
