module.exports =
	{ parse: parse
	}

var fs = require('fs')
  , format = require('util').format
  , utils = require('./utils')
  , importMatcher = /@import (url\()?["']?([^"'()]+)["']?\)?;/g

function parse(file) {
	var content = utils.stripUTF8ByteOrder(fs.readFileSync(file, 'utf8'))
	return content.replace(importMatcher, function(match, junk, file) {
		var parsedFile = parse(file)
		return format('/* %s */%s', match, parsedFile);
	})
}
