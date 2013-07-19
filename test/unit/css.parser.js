describe('unit/css.parser.js', function() {
	var parser = require('../../src/css')
	var fs = require('fs')
	var path = require('path')

	beforeEach(function() {
		fzkes.fake(fs, 'readFileSync').calls(function(file) {
			return 'read ' + file
		})
	})
	afterEach(function() {
		fzkes.restore()
	})

	describe('When providing a data-url', function() {
		it('should not replace forward slashes', function() {
			fs.readFileSync.withArgs('a')
				.returns('a{background:url(data:image/png;base64,abc//def)}')
			var result = parser.parse('a')
			expect(result).to.equal('a{background:url(data:image/png;base64,abc//def)}')
		})
	})

	describe('When providing a root path', function() {
		it('should fix urls according to the base path', function() {
			fs.readFileSync.withArgs('a/b').returns('a{background: url(c);}')
			var result = parser.parse('a/b', 'a')
			expect(result).to.equal('a{background: url(c);}')
		})
		it('should fix imported urls according to the base path', function() {
			fs.readFileSync.withArgs('a/b').returns('@import url(c);')
			fs.readFileSync.withArgs(path.join('a/c')).returns('a{background: url(d);}')
			var result = parser.parse('a/b', 'a')
			expect(result).to.equal('a{background: url(d);}')
		})
		it('should work with absolute base paths', function() {
			fs.readFileSync.withArgs('/a/file').returns('@import url(b/file);')
			fs.readFileSync.withArgs(path.join('/a/b/file')).returns('a{background: url(c/file);}')
			var result = parser.parse('/a/file', '/a')
			expect(result).to.equal('a{background: url(b/c/file);}')
		})
		it('should work with deeper nested base paths', function() {
			fs.readFileSync.withArgs('/a/b/file').returns('@import url(c/file);')
			fs.readFileSync.withArgs(path.join('/a/b/c/file')).returns('a{background: url(d/file);}')
			var result = parser.parse('/a/b/file', '/a')
			expect(result).to.equal('a{background: url(b/c/d/file);}')
		})
		it('should not change absolute import urls', function() {
			fs.readFileSync.withArgs('/a/b').returns('@import url(/absolute/path);')
			parser.parse('/a/b', '/a')
			expect(fs.readFileSync).to.have.been.calledWith('/absolute/path')
		})
		it('should not change other absolute urls', function() {
			fs.readFileSync.withArgs('/a/b').returns('a{background:url(/absolute/path);}')
			var result = parser.parse('/a/b', '/a')
			expect(result).to.equal('a{background:url(/absolute/path);}')
		})
	})
	describe('When parsing an import', function() {
		it('should take the current path into consideration', function() {
			fs.readFileSync.withArgs('a/b').returns('@import url(c);')
			parser.parse('a/b')
			expect(fs.readFileSync).to.have.been.calledWith(path.join('a/c'))
		})
		it('should apply the path to any other urls as well', function() {
			fs.readFileSync.withArgs('a/b').returns('a{background: url(c);}')
			var result = parser.parse('a/b')
			expect(result).to.equal('a{background: url(a/c);}')
		})
		it('should apply the path through imports', function() {
			fs.readFileSync.withArgs('a').returns('@import url(b/c);')
			fs.readFileSync.withArgs(path.join('b/c')).returns('a{background:url(d);')
			var result = parser.parse('a')
			expect(result).to.equal('a{background:url(b/d);')
		})
	})
	describe('When parsing a file with different imports', function() {
		var result
		it('should work with urls containing white-space', function() {
			fs.readFileSync.withArgs('a.css').returns('@import  url(  file  )  ;')
			result = parser.parse('a.css')
			expect(result).to.equal('read file')
		})
		it('should work with strings with single quotes', function() {
			fs.readFileSync.withArgs('a.css').returns("@import 'file';")
			result = parser.parse('a.css')
			expect(result).to.equal('read file')
		})
		it('should work with strings with double quotes', function() {
			fs.readFileSync.withArgs('a.css').returns('@import "file";')
			result = parser.parse('a.css')
			expect(result).to.equal('read file')
		})
		it('should work with urls without quotes', function() {
			fs.readFileSync.withArgs('a.css').returns('@import url(file);')
			result = parser.parse('a.css')
			expect(result).to.equal('read file')
		})
		it('should work with urls with single quotes', function() {
			fs.readFileSync.withArgs('a.css').returns("@import url('file');")
			result = parser.parse('a.css')
			expect(result).to.equal('read file')
		})
		it('should work with urls with double quotes', function() {
			fs.readFileSync.withArgs('a.css').returns('@import url("file");')
			result = parser.parse('a.css')
			expect(result).to.equal('read file')
		})
	})
	describe('When calling parse() with a css file with no imports', function() {
		var result
		beforeEach(function() {
			fs.readFileSync.withArgs('a.css').returns('abc');
			result = parser.parse('a.css')
		})
		it('should ask the file-system for the file', function() {
			expect(fs.readFileSync).to.have.been.calledWith('a.css', 'utf8')
		})
		it('should return the file', function() {
			expect(result).to.equal('abc')
		})
	})
})
