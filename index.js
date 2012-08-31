#!/usr/bin/env node

var program = require('commander')
  , fs = require('fs')
  , path = require('path')
  , sqwish = require('sqwish')
  , uglify = require('uglify-js')
  , stripUTF8ByteOrder = require('./src/utils').stripUTF8ByteOrder

  , glob = require('glob-whatev')

  , input
  , output

program
	.version('0.2.0')
	.option('-o, --output [file]', 'The output file')
	.usage('[--output file] path/to/input')
	.parse(process.argv)

input = program.args[0]

if(!input) {
	program.parse(['bla', 'bla', '--help'])
	process.exit()
}

if(fs.statSync(input).isDirectory()) {
	glob.glob(path.join(input, '**/*.js')).forEach(function(filepath) {
		handleInput(filepath, filepath.replace(/\.(css|js)$/, '.min.$1'))
	})
	glob.glob(path.join(input, '**/*.css')).forEach(function(filepath) {
		handleInput(filepath, filepath.replace(/\.(css|js)$/, '.min.$1'))
	})

	console.log('done minifying all files in %s.', input)
	process.exit()
}


output = program.output || input.replace(/\.(css|js)$/, '.min.$1')

handleInput(input, output)

console.log('done minifying %s. The minified file can be found at %s.', input, output)


function handleInput(input, output) {
	if(!/\.(js|css)$/.test(input)) {
		console.log('Please reference a file with the extension .js or .css. You referenced <%s>', input)
		process.exit(1)
	}

	if(/\.js$/.test(input)) {
		js(input, output)
	} else {
		css(input, output)
	}
}

function js(input, output) {
	var max = fs.readFileSync(input, 'utf8')
	  , max = stripUTF8ByteOrder(max)
	  , ast = uglify.parser.parse(max)
	  , ast = uglify.uglify.ast_mangle(ast)
	  , ast = uglify.uglify.ast_squeeze(ast)
	  , min = uglify.uglify.gen_code(ast, {})

	fs.writeFileSync(output, min)
}

function css(input, output) {
	var parser = require('./src/css')
	  , inDir = path.dirname(input)
	  , outDir = path.dirname(output)
	  , root = path.join(inDir, path.relative(inDir, outDir))
	  , max = parser.parse(input, root)
	  , max = stripUTF8ByteOrder(max)
	  , min = sqwish.minify(max, false)

	fs.writeFileSync(output, min)
}
