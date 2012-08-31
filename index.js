#!/usr/bin/env node

var program = require('commander')
  , fs = require('fs')
  , path = require('path')
  , sqwish = require('sqwish')
  , uglify = require('uglify-js')
  , stripUTF8ByteOrder = require('./src/utils').stripUTF8ByteOrder
  , generateOutput = require('./src/utils').generateOutputName

  , glob = require('glob-whatev')

  , input
  , output
  , template

program
	.version('0.2.0')
	.option('-o, --output [file]', 'The output file')
	.option('-t, --output-template [template]', 'A template for building the output file')
	.usage('[--output file] path/to/input')
	.parse(process.argv)

input = program.args[0]

if(!input) {
	program.parse(['bla', 'bla', '--help'])
	process.exit()
}

output = program.output
template = program.outputTemplate

if(output && template) {
	console.log(
		  'It does not make sense to provide both --output and '
		+ '--output-template options. Please choose one.'
	)
	process.exit(1)
}

if(fs.statSync(input).isDirectory()) {
	glob.glob(path.join(input, '**/*.js')).forEach(handleInput)
	glob.glob(path.join(input, '**/*.css')).forEach(handleInput)

	console.log('done minifying all files in %s.', input)
	process.exit()
}


handleInput(input)

console.log('done minifying %s. The minified file can be found at %s.', input, output)

function handleInput(input) {
	if(!/\.(js|css)$/.test(input)) {
		console.log('Please reference a file with the extension .js or .css. You referenced <%s>', input)
		process.exit(1)
	}

	if(/\.js$/.test(input)) {
		js(input)
	} else {
		css(input)
	}
}

function js(input) {
	var max = fs.readFileSync(input, 'utf8')
	  , max = stripUTF8ByteOrder(max)
	  , ast = uglify.parser.parse(max)
	  , ast = uglify.uglify.ast_mangle(ast)
	  , ast = uglify.uglify.ast_squeeze(ast)
	  , min = uglify.uglify.gen_code(ast, {})
	  , renderedOutput = generateOutput(input, min, output || template)

	fs.writeFileSync(renderedOutput, min)
}

function css(input) {
	var parser = require('./src/css')
	  , inDir = path.dirname(input)
	  , outDir = path.dirname(output || input)
	  , root = path.join(inDir, path.relative(inDir, outDir))
	  , max = parser.parse(input, root)
	  , max = stripUTF8ByteOrder(max)
	  , min = sqwish.minify(max, false)
	  , renderedOutput = generateOutput(input, min, output || template)

	fs.writeFileSync(renderedOutput, min)
}
