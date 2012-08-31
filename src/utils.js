module.exports =
	{ stripUTF8ByteOrder: stripUTF8ByteOrder
	}

function stripUTF8ByteOrder(data) {
	var content = data.toString();
	if(content[0] === '\uFEFF') {
		content = content.substring(1);
	}
	return content;
};
