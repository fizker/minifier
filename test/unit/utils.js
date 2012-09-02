describe('unit/utils.js', function() {
	var utils = require('../../src/utils')
	describe('When calling generateOutputName()', function() {
		describe('with no template vars', function() {
			it('should only inject `min`', function() {
				expect(utils.generateOutputName('a.js', '', null))
					.to.equal('a.min.js')
				expect(utils.generateOutputName('a.css', '', null))
					.to.equal('a.min.css')
			})
		})
		describe('with template-vars', function() {
			it('should replace {{filename}}', function() {
				expect(utils.generateOutputName('a.js', '', '1-{{filename}}-2'))
					.to.equal('1-a-2')
				expect(utils.generateOutputName('a.css', '', '1-{{filename}}-2'))
					.to.equal('1-a-2')
			})
			it('should replace {{ext}}', function() {
				expect(utils.generateOutputName('a.js', '', '1.{{ext}}'))
					.to.equal('1.js')
				expect(utils.generateOutputName('a.css', '', '1.{{ext}}'))
					.to.equal('1.css')
			})
			it('should support md5-hashed content', function() {
				expect(utils.generateOutputName('filename.ext', 'content', '{{md5}}'))
					.to.equal('9a0364b9e99bb480dd25e1f0284c8555')
			})
			it('should support sha-hashed content', function() {
				expect(utils.generateOutputName('filename.ext', 'content', '{{sha}}'))
					.to.equal('ed7002b439e9ac845f22357d822bac1444730fbdb6016d3ec9432297b9ec9f73')
			})
		})
	})
})
