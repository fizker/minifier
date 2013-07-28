describe('unit/minifier.js', function() {
	var minifier = require('../../index')
	var fs = require('fs')
	var path = require('path')

	beforeEach(function() {
		fzkes.fake(fs, 'readFileSync').calls(function(file) {
			return 'read ' + file
		})
		fzkes.fake(fs, 'statSync').returns({ isDirectory: function() { return false } })
		fzkes.fake(fs, 'writeFileSync')
	})
	afterEach(function() {
		fzkes.restore()
	})

	describe('When having a license block in JS', function() {
		var opts
		beforeEach(function() {
			opts = { output: 'out.js' }
		})
		describe('as block comment', function() {
			beforeEach(function() {
				fs.readFileSync.withArgs('a.js')
					.returns('/* test a\n * test\n */\n"a";')
			})
			it('should retain that block', function() {
				minifier.minify('a.js', opts)
				expect(fs.writeFileSync._calls[0][1])
					.to.equal('/* test a\n * test\n */\n"a";')
			})
		})
		describe('as single-line comments', function() {
			beforeEach(function() {
				fs.readFileSync.withArgs('a.js')
					.returns('// test a\n// test\n"a";')
			})
			it('should retain that block', function() {
				minifier.minify('a.js', opts)
				expect(fs.writeFileSync._calls[0][1])
					.to.equal('// test a\n// test\n"a";')
			})
		})
	})

	describe('When having a license block in CSS', function() {
		var opts
		beforeEach(function() {
			opts = { output: 'out.css' }
			fs.readFileSync.withArgs('a.css')
				.returns('/* test a\n * test\n */\na{color:blue}')
			fs.readFileSync.withArgs('b.css')
				.returns('/* test b\n * test\n */\nb{color:green}')
			fs.readFileSync.withArgs('c.css')
				.returns('/* test c\n * test\n */\n@import url(a.css);\n@import url(b.css);')
		})
		describe('in a single file', function() {
			it('should retain that block', function() {
				minifier.minify('a.css', opts)
				expect(fs.writeFileSync._calls[0][1])
					.to.equal('/* test a\n * test\n */\na{color:blue}')
			})
		})
		describe('in referenced files', function() {
			it('should retain all blocks', function() {
				var result = minifier.minify('c.css', opts)
				expect(fs.writeFileSync._calls[0][1])
					.to.equal('/* test c\n * test\n */\n/* test a\n * test\n */\na{color:blue}\n/* test b\n * test\n */\nb{color:green}')
			})
		})
	})
})
