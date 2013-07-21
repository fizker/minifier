describe('integration/api.js.js', function() {
	var minifier = require('../../index')
	var fs = require('fs')
	var path = require('path')
	var input = path.join(__dirname, 'data-js/a.js')
	var output = path.join(__dirname, 'data-js/a.output.js')

	describe('When aimed at a JS file', function() {
		var options
		beforeEach(function() {
			options = { output: output }
			minifier.minify(input, options)
		})
		afterEach(function() {
			fs.unlinkSync(output)
		})
		it('should output a minified version', function() {
			expect(fs.existsSync(output))
				.to.be.ok
		})
		it('should not modify the options object', function() {
			expect(options).to.deep.equal({ output: output })
		})
	})
})
