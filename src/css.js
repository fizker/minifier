module.exports =
	{ parse: parse
	}

var fs = require('fs')
  , path = require('path')
  , format = require('util').format
  , utils = require('./utils')
  , importMatcher = /@import (url\()?["']?([^"'()]+)["']?\)?;/g
  , urlMatcher = /url\((.*)\)/g

function parse(file, absRoot) {
	var root = path.dirname(file)
	  , content = utils.stripUTF8ByteOrder(fs.readFileSync(file, 'utf8'))

	return content
		.replace(importMatcher, function(match, junk, file) {
			var parsedFile = parse(path.join(root, file), absRoot)
			return parsedFile
		})
		.replace(urlMatcher, function(match, url) {
			var newRoot = path.relative(absRoot, root)
			return format('url(%s)', path.join(newRoot, url))
		})
}
