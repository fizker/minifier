describe('integration/api.js.js', function() {
	var minifier = require('../../index')
	var fs = require('fs')
	var path = require('path')
	describe('When aimed at a JS file', function() {
		var input = path.join(__dirname, 'data-js/a.js')
		var output = path.join(__dirname, 'data-js/a.output.js')
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
	describe('When aimed at a folder of JS files', function() {
		var input = path.join(__dirname, 'data-js')
		var options
		beforeEach(function() {
			options = { template: 'output-{{filename}}.{{ext}}' }
			minifier.minify(input, options)
		})
		afterEach(function() {
			options.cleanOnly = true
			minifier.minify(input, options)
		})
		it('should minify both files', function() {
			expect(fs.existsSync(path.join(input, 'output-a.js')))
				.to.be.true
			expect(fs.existsSync(path.join(input, 'output-b.js')))
				.to.be.true
		})

		describe('and the `clean` option is set', function() {
			beforeEach(function() {
				fs.renameSync(path.join(input, 'a.js'), path.join(input, 'aa.js'))
				options.clean = true
				minifier.minify(input, options)
			})
			afterEach(function() {
				fs.renameSync(path.join(input, 'aa.js'), path.join(input, 'a.js'))
			})

			describe('and the `skip` option is set', function() {
				beforeEach(function() {
					options.skip = [ 'b.js' ]
					minifier.minify(input, options)
				})
				it('should skip the right files', function() {
					expect(fs.existsSync(path.join(input, 'output-b.js')))
						.to.be.false
				})
				it('should minify the other file', function() {
					expect(fs.existsSync(path.join(input, 'output-aa.js')))
						.to.be.true
				})
			})

			it('should remove the old files', function() {
				expect(fs.existsSync(path.join(input, 'output-a.js')))
					.to.be.false
			})
			it('should minify both files', function() {
				expect(fs.existsSync(path.join(input, 'output-aa.js')))
					.to.be.true
				expect(fs.existsSync(path.join(input, 'output-b.js')))
					.to.be.true
			})
		})
	})
})
