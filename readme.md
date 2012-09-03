minifier
========

A simple tool for minifying CSS/JS without a big setup.

Feature highlights
------------------

- It minifies JS and CSS
- It reworks URLs in CSS from the original location to the output location.
- It automatically resolves `@import` statements in CSS.


How to install
--------------

There are no way to install it atm. Instead, pull it from github and create an alias.

I know, I know, this is not optimal. But it needs to work before it needs to be pretty :).


How to run from a command-line
------------------------------

Running it is simple:

	minifier [--output path/to/put/file] path/to/file

If the output parameter is not set, it will place a file next to the original,
with the suffix `.min`.

For example, `minifier script.js` will output `script.min.js`, whereas
`minifier --output out.js script.js` will output `out.js`.

A folder can also be targeted. When that is done, it will minify all css and js
file in that folder.

In that case, `--output` does not make much sense, as all files will be minified
to the same. If the name still requires a specific pattern such as a timestamp,
`--template` is the option for you.

There are various options available:

- `{{filename}}` is the original filename.
- `{{ext}}` is the extension.
- `{{sha}}` is a sha-digest of the unminified file contents.
- `{{md5}}` is a md5-digest of the unminified file contents.

For example, `{{filename}}-{{md5}}.min.{{ext}}` will make `abc.js` into something
like `abc-f90731d65c61af25b149658a120d26cf.min.js`.

To avoid the minification of previously minified files, there is a `--clean`
option, which will delete all files that match the output pattern.

This also means that any real files that match the pattern will be removed as
well, so please be careful.


Running from a node-script
--------------------------

It is also possible to run the minifier from within another node script:

	var minifier = require('minifier')
	  , input = '/some/path'

	minifier.on('error', function(err) {
		// handle any potential error
	})
	minifier.minify(input, options)

As with the command-line variant, the input should be a path to either a
javascript file, a css file or a directory.

The options-dictionary takes the same parameters as the command-line variant:

- output: A path-string that tells where to put the output.
- template: A string template for how to build the outputted filenames.
- clean: A bool for whether other files with names similar to the template
    should be deleted before minifying the contents of a directory.


Running the tests
-----------------

After installing from [github](https://github.com/fizker/minifier), simply run
`npm test`.

Alternatively, the `runAllTests.js` script will also execute the tests.

There is also a script called `prepareManualTests.js`, which will run the script
against the css-files inside `test/manual/css/` and provides a real-world
example of the CSS minification tools.

The manual tests can be seen by opening `test/manual/index.html` in a browser
after executing `prepareManualTests.js`.


Credits
-------

In no particular order:

- [sqwish](https://github.com/ded/sqwish) for minifying CSS files.
- [uglify-js](https://github.com/mishoo/UglifyJS) for minifying JS files.
- [commander](https://github.com/visionmedia/commander.js) for command-line
  interaction.
- [mocha](https://github.com/visionmedia/mocha), [chai](http://chaijs.com),
  [sinon](http://cjohansen.no/sinon/) and
  [sinon-chai](https://github.com/domenic/sinon-chai) for testing home-brewed
  logic.
