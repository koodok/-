let Howhap = require('howhap');

function isFunction(functionToCheck) {
	var getType = {};
	return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

module.exports = function(errors, options) {
	options = options || {};
	errors = errors || {};

	const availableErrors = options.availableErrors || {};
	const logger = options.logger || null;

	this.errors = {};

	if(Object.prototype.toString.call(errors) !== '[object Object]') {
		throw new Howhap({
			message: 'errors must be an object',
			status: 500
		});
	}

	if(Object.prototype.toString.call(availableErrors) !== '[object Object]') {
		throw new Howhap({
			message: 'options.availableErrors must be an object',
			status: 500
		});
	}

	if(logger && Object.prototype.toString.call(logger) !== '[object Object]') {
		throw new Howhap({
			message: 'options.logger must be an object',
			status: 500
		});
	}

	for(let i in errors) {
		this.errors[i] = new Howhap(errors[i]);
	}

	this.add = function(messageStatus, params, key) {
		if(typeof params === 'string' && !key) {
			key = params;
			params = {};
		}

		if(typeof messageStatus === 'string') {
			messageStatus = getError(messageStatus);
		}

		key = key || 'default';

		this.errors[key] = new Howhap(messageStatus, params);

		if(logger) {
			logger[messageStatus.level || 'debug'](
				messageStatus.message,
				messageStatus.status,
				params
			);
		}
		return this;
	};

	this.remove = function(key) {
		delete this.errors[key];
	};

	this.toJSON = function() {
		let returnErrors = {};
		for(let i in this.errors) {
			returnErrors[i] = this.errors[i].toString();
		};
		return returnErrors;
	};

	this.toObject = function() {
		let returnErrors = {};
		for(let i in this.errors) {
			returnErrors[i] = this.errors[i].toJSON();
		};
		return returnErrors;
	};

	this.display = function(key = 'default', defaultValue = '') {
		if(!this.errors.hasOwnProperty(key)) {
			return defaultValue;
		}
		return this.errors[key].toString();
	};

	function getError(descriptor) {
		// First check to see if the descriptor exists in the list of available errors.
		if(availableErrors.hasOwnProperty(descriptor)) {
			return availableErrors[descriptor];
		}

		// If it doesn't then assume it's a chain of property names, for example:
		// AUTH.BAD_PASSWORD and we should traverse the availableErrors object to find
		// the appropriate nested property.
		let props = descriptor.split('.');
		let target = availableErrors;
		for(let i=0; i<props.length; i++) {
			let prop = props[i];
			if(target.hasOwnProperty(prop)) {
				target = target[prop];
			}
			else {
				throw 'Could not find an error with descriptor '+descriptor;
			}
		}

		return target;
	}
};