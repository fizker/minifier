var fs = require('fs')
var path = require('path')
var format = require('util').format
var sqwish = require('sqwish')
var uglify = require('uglify-js')
var stripUTF8ByteOrder = require('./utils').stripUTF8ByteOrder
var generateOutput = require('./utils').generateOutputName
var glob = require('glob')
var cssParser = require('./css')

var EventEmitter = require('events').EventEmitter
var obj = new EventEmitter()

obj.minify = minify
obj.generateOutputName = generateOutput

module.exports = obj

function minify(input, options) {
	if(!options) options = {}
	var output
	var template

	if(!input) {
		obj.emit('error', new Error('The input is required'))
	}

	if(options.cleanOnly) {
		options.clean = true
	}
	output = options.output
	template = options.template

	if(output && template) {
		return obj.emit(
			  'error'
			,   new Error('It does not make sense to provide both --output and '
			  + '--template options. Please choose one.')
		)
	}

	if(fs.statSync(input).isDirectory()) {
		if(output) {
			return obj.emit('error',
				new Error('You cannot use `output` option against a directory'))
		}
		if(options.clean) {
			clean(input, template || '{{filename}}.min.{{ext}}')
		}
		if(options.cleanOnly) {
			return
		}

		glob.sync(path.join(input, '**/*.js')).every(handleInput)
		glob.sync(path.join(input, '**/*.css')).every(handleInput)

		return
	}

	if(options.clean) {
		clean(path.dirname(input), output || template)
	}

	handleInput(input)

	function handleInput(input) {
		if(!/\.(js|css)$/.test(input)) {
			obj.emit(
				  'error'
				, new Error(format(
				    'Please reference a file with the extension .js or .css. You referenced <%s>'
				  , input
				  ))
				)
			return false
		}

		if(/\.js$/.test(input)) {
			js(input)
		} else {
			css(input)
		}
		return true
	}

	function js(input) {
		var min = uglify.minify(input).code
		var opts = { content: min, template: template }
		var renderedOutput = output || generateOutput(input, opts)

		fs.writeFileSync(renderedOutput, min)
	}

	function css(input) {
		var inDir = path.dirname(input)
		var outDir = path.dirname(output || input)
		var root = path.join(inDir, path.relative(inDir, outDir))
		var max = cssParser.parse(input, root)
		var max = stripUTF8ByteOrder(max)
		var min = sqwish.minify(max, false)
		var opts = { content: min, template: template }
		var renderedOutput = output || generateOutput(input, opts)

		fs.writeFileSync(renderedOutput, min)
	}

	function clean(dir, template) {
		template = template.replace(/{{[^}]*}}/g, '*')
		glob.sync(path.join(dir, '**/', template)).forEach(function(file) {
			fs.unlinkSync(file)
		})
	}
}
