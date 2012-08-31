!function() {
	// assume node (or node-compatible)
	if(typeof(module) == 'object' && module.exports) {
		module.exports.extend = extend;
	} else {
	// assume the browser. sinon is included before now
		extend(sinon);
	}

	function extend(sinon) {
		sinon.scope = createScope;
		sinon.fake = sinon.stub
	};

	function createScope() {
		var fakes = []

		return (
			{ stub: stub
			, spy: spy
			, fake: stub
			, restore: restore
			}
		);

		function spy(obj, func) {
			var fake = sinon.spy(obj, func)
			fakes.push(fake);
			return fake;
		};
		function stub(obj, func) {
			var fake = sinon.stub(obj, func);
			fakes.push(fake);
			return fake;
		};
		function restore() {
			fakes.forEach(function(fake) {
				fake.restore();
			});
			fakes = [];
		};
	};
}();