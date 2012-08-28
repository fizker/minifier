module.exports = {
	addMethods: addMethods
};

function addMethods(chai) {
	require('./compare').addMethod(chai);
};
