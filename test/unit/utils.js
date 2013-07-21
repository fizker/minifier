describe('unit/utils.js', function() {
	var utils = require('../../src/utils')
	var minifier = require('../../index')
	it('should expose `generateOutputName`', function() {
		expect(minifier.generateOutputName).to.equal(utils.generateOutputName)
	})
	describe('When calling `generateOutputName()`', function() {
		describe('with no template vars', function() {
			it('should only inject `min`', function() {
				expect(utils.generateOutputName('a.js'))
					.to.equal('a.min.js')
				expect(utils.generateOutputName('a.css'))
					.to.equal('a.min.css')
			})
		})
		describe('with template-vars', function() {
			it('should place the output next to the input', function() {
				var opts = { template: '1.{{ext}}' }
				expect(utils.generateOutputName('a/b.js', opts))
					.to.equal('a/1.js')
			})
			it('should replace {{filename}}', function() {
				var opts = { template: '1-{{filename}}-2' }
				expect(utils.generateOutputName('a.js', opts))
					.to.equal('1-a-2')
				expect(utils.generateOutputName('a.css', opts))
					.to.equal('1-a-2')
			})
			it('should replace {{ext}}', function() {
				var opts = { template: '1.{{ext}}' }
				expect(utils.generateOutputName('a.js', opts))
					.to.equal('1.js')
				expect(utils.generateOutputName('a.css', opts))
					.to.equal('1.css')
			})
		})
		describe('with `{{md5}}`', function() {
			it('should throw an exception if no content is given', function() {
				var opts =
				    { template: '{{md5}}'
				    }
				expect(function() {
					utils.generateOutputName('filename.ext', opts)
				}).to.throw(/content.*required/i)
			})
			it('should support digest content correctly', function() {
				var opts =
				    { content: 'content'
				    , template: '{{md5}}'
				    }
				expect(utils.generateOutputName('filename.ext', opts))
					.to.equal('9a0364b9e99bb480dd25e1f0284c8555')
			})
		})
		describe('with `{{sha}}`', function() {
			it('should throw an exception if no content is given', function() {
				var opts =
				    { template: '{{sha}}'
				    }
				expect(function() {
					utils.generateOutputName('filename.ext', opts)
				}).to.throw(/content.*required/i)
			})
			it('should support sha-hashed content', function() {
				var opts =
				    { content: 'content'
				    , template: '{{sha}}'
				    }
				expect(utils.generateOutputName('filename.ext', opts))
					.to.equal('ed7002b439e9ac845f22357d822bac1444730fbdb6016d3ec9432297b9ec9f73')
			})
		})
		describe('with `regex` flag', function() {
			it('should return a regex', function() {
				var opts = { regex: true }
				expect(utils.generateOutputName('a.b', opts))
					.to.be.a('RegExp')
			})
			it('should escape `.` properly', function() {
				var opts = { regex: true, template: 'a.min.b' }
				expect(utils.generateOutputName('a.b', opts).toString())
					.to.equal('/a\\.min\\.b/')
			})
			it('should return `.*` for `{{sha}}`', function() {
				var opts = { regex: true, template: '{{filename}}.{{sha}}.{{ext}}' }
				expect(utils.generateOutputName('a.b', opts).toString())
					.to.equal('/a\\..*\\.b/')
			})
			it('should return `.*` for `{{md5}}`', function() {
				var opts = { regex: true, template: '{{filename}}.{{md5}}.{{ext}}' }
				expect(utils.generateOutputName('a.b', opts).toString())
					.to.equal('/a\\..*\\.b/')
			})
		})
		describe('with `glob` flag', function() {
			it('should return a string', function() {
				var opts = { glob: true }
				expect(utils.generateOutputName('a.b', opts))
					.to.be.a('string')
			})
			it('should return `*` for `{{sha}}`', function() {
				var opts = { glob: true, template: '{{filename}}.{{sha}}.{{ext}}' }
				expect(utils.generateOutputName('a.b', opts))
					.to.equal('a.*.b')
			})
			it('should return `*` for `{{md5}}`', function() {
				var opts = { glob: true, template: '{{filename}}.{{md5}}.{{ext}}' }
				expect(utils.generateOutputName('a.b', opts))
					.to.equal('a.*.b')
			})
		})
	})
})
