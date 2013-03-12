module.exports =
	{ parse: parse
	}

var fs = require('fs')
  , path = require('path')
  , format = require('util').format
  , utils = require('./utils')
  , stringImportMatcher = /@import ["'](.+)["'];/g
  , importMatcher = /@import +(url\()?([^()]+)\)? *;/g
  , urlMatcher = /url\(["']?([^"'()]+)["']?\)/g
  , absoluteUrl = /^([a-zA-Z]:\/)?\//

function parse(file, absRoot) {
	var root = path.dirname(file)
	  , absRoot = absRoot || ''
	  , relRoot = path.relative(absRoot, root)
	  , content = utils.stripUTF8ByteOrder(fs.readFileSync(file, 'utf8'))

	return content
		.replace(stringImportMatcher, function(match, url) {
			return format('@import url(%s);', url)
		})
		.replace(urlMatcher, function(match, url) {
			url = url.trim()
			if(!url.match(absoluteUrl)) {
				url = path.join(relRoot, url).replace(/\\/g, '/')
			}
			return format('url(%s)', url)
		})
		.replace(importMatcher, function(match, junk, file) {
			if(!file.match(absoluteUrl)) {
				file = path.join(absRoot, file)
			}
			var parsedFile = parse(file, absRoot)
			return parsedFile
		})
}
