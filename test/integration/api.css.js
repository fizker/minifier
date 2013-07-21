describe('integration/api.css.js', function() {
	var minifier = require('../../index')
	var fs = require('fs')
	var path = require('path')

	describe('When calling the api on a folder', function() {
		var input = path.join(__dirname, 'data')
		var template = '{{filename}}.{{md5}}.out.{{ext}}'

		beforeEach(function() {debugger
			minifier.minify(input, { template: template })
		})
		afterEach(function() {
			safeDelete(path.join(__dirname, 'data/a.63c803912abe72f892fd24fbdb428eda.out.css'))
			safeDelete(path.join(__dirname, 'data/b.0ef167c4cedf9850d3efb1a0507b8b7f.out.css'))
			safeDelete(path.join(__dirname, 'data/a/c.86bc73330e434bf294807fbe6056d40c.out.css'))
			safeDelete(path.join(__dirname, 'data/b/d.a6deef4497cce70a5aeaefca0e490c03.out.css'))
		})

		it('should minify all the files', function() {
			expect(fs.existsSync(path.join(__dirname, 'data/a.63c803912abe72f892fd24fbdb428eda.out.css')))
				.to.be.true
			expect(fs.existsSync(path.join(__dirname, 'data/b.0ef167c4cedf9850d3efb1a0507b8b7f.out.css')))
				.to.be.true
			expect(fs.existsSync(path.join(__dirname, 'data/a/c.86bc73330e434bf294807fbe6056d40c.out.css')))
				.to.be.true
			expect(fs.existsSync(path.join(__dirname, 'data/b/d.a6deef4497cce70a5aeaefca0e490c03.out.css')))
				.to.be.true
		})
		describe('with the `clean` option set', function() {
			var oldContent
			beforeEach(function() {
				oldContent = fs.readFileSync(path.join(input, 'a.css'))
				fs.writeFileSync(path.join(__dirname, 'data/a.css'), 'abc{}')
				minifier.minify(input, { template: template, clean: true })
			})
			afterEach(function() {
				fs.writeFileSync(path.join(__dirname, 'data/a.css'), oldContent)
				safeDelete(path.join(__dirname, 'data/a.34c67064c3f76ca1f5798ad0fd1f8f98.out.css'))
			})
			it('should delete the old file', function() {
				expect(fs.existsSync(path.join(__dirname, 'data/a.63c803912abe72f892fd24fbdb428eda.out.css')))
					.to.be.false
				expect(fs.existsSync(path.join(__dirname, 'data/b.0ef167c4cedf9850d3efb1a0507b8b7f.out.css')))
					.to.be.true
				expect(fs.existsSync(path.join(__dirname, 'data/a/c.86bc73330e434bf294807fbe6056d40c.out.css')))
					.to.be.true
				expect(fs.existsSync(path.join(__dirname, 'data/b/d.a6deef4497cce70a5aeaefca0e490c03.out.css')))
					.to.be.true
			})
			it('should create the new file correctly', function() {
				expect(fs.existsSync(path.join(__dirname, 'data/a.34c67064c3f76ca1f5798ad0fd1f8f98.out.css')))
					.to.be.true
			})
		})
	})
	describe('When calling the api on a single file', function() {
		var input = path.join(__dirname, 'data/a.css')
		var output = path.join(__dirname, 'data/a.output.css')
		beforeEach(function() {
			minifier.minify(input, { output: output })
		})
		afterEach(function() {
			safeDelete(output)
		})

		it('should create the minified file', function() {
			expect(fs.existsSync(output)).to.be.ok
		})
		it('should reformat the url correctly', function() {
			var contents = fs.readFileSync(output, 'utf8')
			expect(contents).to.match(/\.nested-img[^}]+..\/gfx\/img\.png/)
		})
		it('should import all files', function() {
			var contents = fs.readFileSync(output, 'utf8')
			expect(contents)
				.to.contain('.a-file')
				.and.to.contain('.b-file')
				.and.to.contain('.c-file')
				.and.to.contain('.d-file')
		})
	})

	function safeDelete(file) {
		fs.existsSync(file) && fs.unlinkSync(file)
	}
})
