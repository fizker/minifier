var fs = require('fs')
  , path = require('path')
  , format = require('util').format
  , sqwish = require('sqwish')
  , uglify = require('uglify-js')
  , stripUTF8ByteOrder = require('./utils').stripUTF8ByteOrder
  , generateOutput = require('./utils').generateOutputName
  , glob = require('glob-whatev')
  , cssParser = require('./css')

  , EventEmitter = require('events').EventEmitter
  , obj = new EventEmitter()

obj.minify = minify

module.exports = obj

function minify(input, options) {
	var output
	  , template

	if(!input) {
		obj.emit('error', new Error('The input is required'))
	}

	output = options.output
	template = options.template

	if(output && template) {
		obj.emit(
			  'error'
			,   new Error('It does not make sense to provide both --output and '
			  + '--template options. Please choose one.')
		)
	}

	if(fs.statSync(input).isDirectory()) {
		if(options.clean) {
			clean(input, template || '{{filename}}.min.{{ext}}')
		}

		glob.glob(path.join(input, '**/*.js')).every(handleInput)
		glob.glob(path.join(input, '**/*.css')).every(handleInput)

		return
	}

	handleInput(input)

	function handleInput(input) {
		if(!/\.(js|css)$/.test(input)) {
			obj.on(
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
		  , renderedOutput = generateOutput(input, min, output || template)

		fs.writeFileSync(renderedOutput, min)
	}

	function css(input) {
		var inDir = path.dirname(input)
		  , outDir = path.dirname(output || input)
		  , root = path.join(inDir, path.relative(inDir, outDir))
		  , max = cssParser.parse(input, root)
		  , max = stripUTF8ByteOrder(max)
		  , min = sqwish.minify(max, false)
		  , renderedOutput = generateOutput(input, min, output || template)

		fs.writeFileSync(renderedOutput, min)
	}

	function clean(dir, template) {
		template = template.replace(/{{[^}]*}}/g, '*')
		glob.glob(path.join(dir, '**/', template)).forEach(function(file) {
			fs.unlink(file)
		})
	}
}
