minifier
========

A simple tool for minifying CSS/JS without a big setup.

It is simply a command-line access for running the minification tools built into grunt.


How to install:
---------------

There are no way to install it atm. Instead, pull it from github and create an alias.

I know, I know, this is not optimal. But it needs to work before it needs to be pretty :).


How to run:
-----------

Running it is simple:

	minifier [--out path/to/put/file] path/to/file

If the output parameter is not set, it will place a file next to the original,
with the suffix `.min`.

For example, `minifier script.js` will output `script.min.js`, whereas
`minifier --output out.js script.js` will output `out.js`.
