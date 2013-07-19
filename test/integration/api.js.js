describe('integration/api.js.js', function() {
	var minifier = require('../../index')
	var fs = require('fs')
	var path = require('path')
	describe('When aimed at a JS file', function() {
		var input = path.join(__dirname, 'data-js/a.js')
		var output = path.join(__dirname, 'data-js/a.output.js')
		beforeEach(function() {
			minifier.minify(
			  input
			, { output: output
			  }
			)
		})
		afterEach(function() {
			fs.unlinkSync(output)
		})
		it('should output a minified version', function() {
			expect(fs.existsSync(output))
				.to.be.ok
		})
	})
})
