describe('integration/api.errors.js', function() {
	var minifier = require('../../index')
	var fs = require('fs')
	var path = require('path')

	beforeEach(function() {
		fzkes.fake(fs, 'writeFile')
		fzkes.fake(fs, 'writeFileSync')
	})
	afterEach(function() {
		fzkes.restore()
	})

	describe('When giving input as a non-supported filetype', function() {
		var input
		beforeEach(function() {
			input = path.join(__dirname, 'data/a.html')
		})
		it('should throw an error', function() {
			expect(function() {
				minifier.minify(input)
			}).to.throw()
		})
		describe('and listening to `error` event', function() {
			var listener
			beforeEach(function() {
				listener = fzkes.fake('listener')
				minifier.on('error', listener)

				minifier.minify(input)
			})
			afterEach(function() {
				minifier.removeListener('error', listener)
			})
			it('should emit the event', function() {
				expect(listener).to.have.been.called
			})
			it('should not create the files', function() {
				expect(fs.writeFile).not.to.have.been.called
				expect(fs.writeFileSync).not.to.have.been.called
			})
		})
	})
	describe('When giving both `output` and `template` option', function() {
		var input
		var options
		beforeEach(function() {
			input = path.join(__dirname, 'data-js/a.js')
			options =
				{ output: 'a.min.js'
				, template: 'abc'
				}
		})
		it('should throw', function() {
			expect(function() {
				minifier.minify(input, options)
			}).to.throw()
		})
		describe('and listening to `error` event', function() {
			var listener
			beforeEach(function() {
				listener = fzkes.fake('listener')
				minifier.on('error', listener)

				minifier.minify(input, options)
			})
			afterEach(function() {
				minifier.removeListener('error', listener)
			})
			it('should emit the event', function() {
				expect(listener).to.have.been.called
			})
			it('should not create the files', function() {
				expect(fs.writeFile).not.to.have.been.called
				expect(fs.writeFileSync).not.to.have.been.called
			})
		})
	})
	describe('When giving `output` option against a directory', function() {
		var input
		var options
		beforeEach(function() {
			input = path.join(__dirname, 'data-js')
			options = { output: 'a.b' }
		})
		it('should throw', function() {
			expect(function() {
				minifier.minify(input, options)
			}).to.throw()
		})
		describe('and listening to `error` event', function() {
			var listener
			beforeEach(function() {
				listener = fzkes.fake('listener')
				minifier.on('error', listener)

				minifier.minify(input, options)
			})
			afterEach(function() {
				minifier.removeListener('error', listener)
			})
			it('should give the error', function() {
				expect(listener).to.have.been.called
			})
			it('should not create the files', function() {
				expect(fs.writeFile).not.to.have.been.called
				expect(fs.writeFileSync).not.to.have.been.called
			})
		})
	})
})
