module.exports =
	{ stripUTF8ByteOrder: stripUTF8ByteOrder
	, generateOutputName: generateOutputName
	}

var format = require('util').format
  , hogan = require('hogan.js')
  , digest = require('crypto').createHash

function generateOutputName(input, inputContent, outputTemplate) {
	var extractedInput =
		{ md5: generate.bind(null, 'md5')
		, sha: generate.bind(null, 'sha256')
		}
	input.replace(/^(.*)\.([^.]+)$/, function(match, file, ext) {
		extractedInput.ext = ext
		extractedInput.filename = file
		return ''
	})

	return hogan.compile(outputTemplate || '{{filename}}.min.{{ext}}').render(extractedInput)

	function generate(algorithm) {
		var digester = digest(algorithm)
		digester.update(inputContent, 'utf8')
		return digester.digest('hex')
	}
}

function stripUTF8ByteOrder(data) {
	var content = data.toString()
	if(content[0] === '\uFEFF') {
		content = content.substring(1)
	}
	return content
}
