if(typeof(module) == 'object' && module.exports) {
	module.exports = {
		compare: compare,
		addMethod: addMethod
	};
} else {
	addMethod(chai);
}

function addMethod(chai) {
	chai.Assertion.addChainableMethod('approximate', function(expected) {
		var actual = this.__flags.object
		this.assert(
			compare(actual, expected),
			'expected #{this} to approximate #{exp}',
			'expected #{this} not to approximate #{exp}',
			expected
		);
	})
};

function compare(actual, expected) {
	if(typeof(actual) !== typeof(expected)) return false;
	if(typeof(expected) !== 'object') {
		return expected === actual;
	}

	if(Array.isArray(expected)) {
		if(typeof(actual.length) !== 'number') {
			return false;
		}
		var aa = Array.prototype.slice.call(actual)
		return expected.every(function(exp) {
			var index
			if(!aa.some(function(act, i) {
				index = i
				return compare(act, exp);
			})) {
				return false;
			}
			aa.splice(index, 1);
			return true;
		});
	}

	return Object.keys(expected).every(function(key) {
		var eo = expected[key]
		  , ao = actual[key]
		if(typeof(eo) === 'object' && eo !== null && ao !== null) {
			return compare(ao, eo);
		}
		return ao === eo;
	});
};
