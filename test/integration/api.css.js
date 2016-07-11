describe('integration/api.css.js', function() {
	var minifier = require('../../index')
	var fs = require('fs')
	var path = require('path')

	describe('When calling the api on a folder', function() {
		const input = path.join(__dirname, 'data')
		const template = '{{filename}}.{{md5}}.out.{{ext}}'

		beforeEach(function() {
			minifier.minify(input, { template: template })
		})
		afterEach(function() {
			safeDelete(path.join(__dirname, 'data/a.5fe39ce3416b224850714849c52781ee.out.css'))
			safeDelete(path.join(__dirname, 'data/b.463682a6278fbd2d2c7c3691a4f5b441.out.css'))
			safeDelete(path.join(__dirname, 'data/a/c.ef9596f4e227fdc4d4131f2e9b278e00.out.css'))
			safeDelete(path.join(__dirname, 'data/b/d.a8c574a0b15ea78c32e0ea5db202ad21.out.css'))
		})

		it('should minify all the files', function() {
			expect(fs.existsSync(path.join(__dirname, 'data/a.5fe39ce3416b224850714849c52781ee.out.css')))
				.to.be.true
			expect(fs.existsSync(path.join(__dirname, 'data/b.463682a6278fbd2d2c7c3691a4f5b441.out.css')))
				.to.be.true
			expect(fs.existsSync(path.join(__dirname, 'data/a/c.ef9596f4e227fdc4d4131f2e9b278e00.out.css')))
				.to.be.true
			expect(fs.existsSync(path.join(__dirname, 'data/b/d.a8c574a0b15ea78c32e0ea5db202ad21.out.css')))
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
				expect(fs.existsSync(path.join(__dirname, 'data/a.5fe39ce3416b224850714849c52781ee.out.css')))
					.to.be.false
				expect(fs.existsSync(path.join(__dirname, 'data/b.463682a6278fbd2d2c7c3691a4f5b441.out.css')))
					.to.be.true
				expect(fs.existsSync(path.join(__dirname, 'data/a/c.ef9596f4e227fdc4d4131f2e9b278e00.out.css')))
					.to.be.true
				expect(fs.existsSync(path.join(__dirname, 'data/b/d.a8c574a0b15ea78c32e0ea5db202ad21.out.css')))
					.to.be.true
			})
			it('should create the new file correctly', function() {
				expect(fs.existsSync(path.join(__dirname, 'data/a.34c67064c3f76ca1f5798ad0fd1f8f98.out.css')))
					.to.be.true
			})
		})
		describe('with the `cleanOnly` option set', function() {
			beforeEach(function() {
				minifier.minify(input, { template: template, cleanOnly: true })
			})
			it('should clean but not create the files', function() {
				expect(fs.existsSync(path.join(__dirname, 'data/a.5fe39ce3416b224850714849c52781ee.out.css')))
					.to.be.false
				expect(fs.existsSync(path.join(__dirname, 'data/b.463682a6278fbd2d2c7c3691a4f5b441.out.css')))
					.to.be.false
				expect(fs.existsSync(path.join(__dirname, 'data/a/c.ef9596f4e227fdc4d4131f2e9b278e00.out.css')))
					.to.be.false
				expect(fs.existsSync(path.join(__dirname, 'data/b/d.a8c574a0b15ea78c32e0ea5db202ad21.out.css')))
					.to.be.false
			})
		})
	})
	describe('When calling the api on a single file', function() {
		const input = path.join(__dirname, 'data/a.css')
		const output = path.join(__dirname, 'a.output.css')
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
			expect(contents).to.match(/\.nested-img[^}]+gfx\/img\.png/)
		})
		it('should import all files', function() {
			var contents = fs.readFileSync(output, 'utf8')
			expect(contents)
				.to.contain('.a-file')
				.and.to.contain('.b-file')
				.and.to.contain('.c-file')
				.and.to.contain('.d-file')
		})
		describe('with the `cleanOnly` option set', function() {
			beforeEach(function() {
				minifier.minify(input, { output: output, cleanOnly: true })
			})
			it('should remove the file', function() {
				expect(fs.existsSync(output)).to.be.false
			})
		})
		describe('with the `template` option set', function() {
			const template = 'template.{{md5}}.out.{{ext}}'
			const firstOutput = path.join(__dirname, 'data/template.5fe39ce3416b224850714849c52781ee.out.css')
			beforeEach(function() {
				minifier.minify(input, { template: template })
			})
			afterEach(function() {
				safeDelete(firstOutput)
			})
			it('should create the file correctly', function() {
				expect(fs.existsSync(firstOutput))
					.to.be.true
			})
			describe('and the `clean` option', function() {
				var oldContent
				const secondOutput = path.join(__dirname, 'data/template.34c67064c3f76ca1f5798ad0fd1f8f98.out.css')
				beforeEach(function() {
					oldContent = fs.readFileSync(input)
					fs.writeFileSync(input, 'abc{}')
					minifier.minify(input, { template: template, clean: true })
				})
				afterEach(function() {
					fs.writeFileSync(input, oldContent)
					safeDelete(secondOutput)
				})
				it('should delete the old file', function() {
					expect(fs.existsSync(firstOutput))
						.to.be.false
				})
				it('should create the new file', function() {
					expect(fs.existsSync(secondOutput))
						.to.be.true
				})
			})
			describe('and the `cleanOnly` option', function() {
				beforeEach(function() {
					minifier.minify(input, { template: template, cleanOnly: true })
				})
				it('should clean, but not create the file', function() {
					expect(fs.existsSync(firstOutput))
						.to.be.false
				})
			})
		})
	})
	describe('When calling the api on a list of files', function() {
		const inputs = ['a/c', 'b'].map(x => path.join(__dirname, `data/${x}.css`))
		const output = path.join(__dirname, 'output.css')
		beforeEach(function() {
			minifier.minify(inputs, { output: output })
		})
		afterEach(function() {
			safeDelete(output)
		})

		it('should create the minified file', function() {
			expect(fs.existsSync(output)).to.be.ok
		})
		it('should reformat the url correctly', function() {
			var contents = fs.readFileSync(output, 'utf8')
			expect(contents).to.match(/\.nested-img[^}]+gfx\/img\.png/)
		})
		it('should import all files', function() {
			var contents = fs.readFileSync(output, 'utf8')
			expect(contents)
				.to.contain('.b-file')
				.and.to.contain('.c-file')
				.and.to.contain('.d-file')
		})
		describe('with the `cleanOnly` option set', function() {
			beforeEach(function() {
				minifier.minify(inputs, { output: output, cleanOnly: true })
			})
			it('should remove the file', function() {
				expect(fs.existsSync(output)).to.be.false
			})
		})
		describe('with the `template` option set', function() {
			const template = 'template.{{md5}}.out.{{ext}}'
			const firstOutput = path.join(__dirname, 'data/a/template.1909ce21348346f98abc37cbeae8e805.out.css')
			beforeEach(function() {
				minifier.minify(inputs, { template: template })
			})
			afterEach(function() {
				safeDelete(firstOutput)
			})
			it('should create the file correctly', function() {
				expect(fs.existsSync(firstOutput))
					.to.be.true
			})
			describe('and the `clean` option', function() {
				var oldContent
				const secondOutput = path.join(__dirname, 'data/a/template.09c2d80354dcf526e64518d1bd60560b.out.css')
				beforeEach(function() {
					oldContent = fs.readFileSync(inputs[0])
					fs.writeFileSync(inputs[0], 'abc{}')
					minifier.minify(inputs, { template: template, clean: true })
				})
				afterEach(function() {
					fs.writeFileSync(inputs[0], oldContent)
					safeDelete(secondOutput)
				})
				it('should delete the old file', function() {
					expect(fs.existsSync(firstOutput))
						.to.be.false
				})
				it('should create the new file', function() {
					expect(fs.existsSync(secondOutput))
						.to.be.true
				})
			})
			describe('and the `cleanOnly` option', function() {
				beforeEach(function() {
					minifier.minify(inputs, { template: template, cleanOnly: true })
				})
				it('should clean, but not create the file', function() {
					expect(fs.existsSync(firstOutput))
						.to.be.false
				})
			})
		})
	})

	function safeDelete(file) {
		fs.existsSync(file) && fs.unlinkSync(file)
	}
})
