module.exports =
	{ parse: parse
	}

var fs = require('fs')
  , path = require('path')
  , format = require('util').format
  , utils = require('./utils')
  , stringImportMatcher = /@import ["'](.+)["'];/g
  , importMatcher = /@import (url\()?([^()]+)\)?;/g
  , urlMatcher = /url\(["']?([^"'()]+)["']?\)/g

function parse(file, absRoot) {
	var root = path.dirname(file)
	  , relRoot = path.relative(absRoot, root)
	  , content = utils.stripUTF8ByteOrder(fs.readFileSync(file, 'utf8'))

	return content
		.replace(stringImportMatcher, function(match, url) {
			return format('@import url(%s);', url)
		})
		.replace(urlMatcher, function(match, url) {
			return format('url(%s)', path.join(relRoot, url))
		})
		.replace(importMatcher, function(match, junk, file) {
			var parsedFile = parse(path.join(absRoot, file), absRoot)
			return parsedFile
		})
}
