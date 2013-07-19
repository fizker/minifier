describe('integration/api.css.js', function() {
	var minifier = require('../../index')
	var fs = require('fs')
	var path = require('path')

	describe('When calling the api on a folder', function() {
		var input = path.join(__dirname, 'data')
		var template = '{{filename}}.{{md5}}.{{ext}}'

		beforeEach(function() {
			minifier.minify(
				  input
				, { template: template
				  }
			)
		})
		afterEach(function() {
			fs.unlinkSync(path.join(__dirname, 'data/a.63c803912abe72f892fd24fbdb428eda.css'))
			fs.unlinkSync(path.join(__dirname, 'data/b.0ef167c4cedf9850d3efb1a0507b8b7f.css'))
			fs.unlinkSync(path.join(__dirname, 'data/a/c.86bc73330e434bf294807fbe6056d40c.css'))
			fs.unlinkSync(path.join(__dirname, 'data/b/d.a6deef4497cce70a5aeaefca0e490c03.css'))
		})

		it('should minify all the files', function() {
			expect(fs.existsSync(path.join(__dirname, 'data/a.63c803912abe72f892fd24fbdb428eda.css')))
				.to.be.ok
			expect(fs.existsSync(path.join(__dirname, 'data/b.0ef167c4cedf9850d3efb1a0507b8b7f.css')))
				.to.be.ok
			expect(fs.existsSync(path.join(__dirname, 'data/a/c.86bc73330e434bf294807fbe6056d40c.css')))
				.to.be.ok
			expect(fs.existsSync(path.join(__dirname, 'data/b/d.a6deef4497cce70a5aeaefca0e490c03.css')))
				.to.be.ok
		})
	})
	describe('When calling the api on a single file', function() {
		var input = path.join(__dirname, 'data/a.css')
		var output = path.join(__dirname, 'data/a.output.css')
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
})
