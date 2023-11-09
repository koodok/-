/*
 * Stores and formats error information.
 *
 * let err =  new Howhap(
 *		{
 *		 	message: 'This is wrong: {{ what }}',
 *		 	status: 400
 *		},
 *		{
 *			what: 'me'
 *		}
 * );
 * res.status(err.status()).json(err.toJSON());
 * res.render('error-page', { error: err.toJSON() });
 */
let Hogan = require('hogan.js');

class Howhap {
	constructor(messageStatus, constructorParams) {
		if(Object.prototype.toString.call(messageStatus) !== '[object Object]') {
			throw new Error('First argument to Howhap constructor must be an object.');
		}
		if(!messageStatus.hasOwnProperty('message')) {
			throw new Error('First argument to Howhap constructor must contain a message property.');
		}
		if(!messageStatus.hasOwnProperty('status')) {
			throw new Error('First argument to Howhap constructor must contain a status property.');
		}

		if(constructorParams === undefined || constructorParams === null) {
			if(messageStatus.hasOwnProperty('params')) {
				constructorParams = messageStatus.params;
			}
			else {
				constructorParams = {};
			}
		}

		this._message = null;
		this._status = null;
		this._params = null;
		this._template = null;

		this.message = messageStatus.message;
		this.status = messageStatus.status;
		this.params = constructorParams;
		this.name = 'Howhap';
	}

	toString() {
		return this._template.render(this._params);
	}

	toJSON() {
		let newParams = {};
		for(let i in this._params) {
			newParams[i] = ''+this._params[i];
		}
		return {
			message: this._message,
			status: this._status,
			params: newParams
		};
	}

	set(obj) {
		if(obj.hasOwnProperty('message')) {
			this.message = obj.message;
		}
		if(obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}
		if(obj.hasOwnProperty('params')) {
			this.params = obj.params;
		}
	}

	get message() {
		return this._message;
	}

	set message(val) {
		if(typeof val !== 'string' && !(val instanceof String)) {
			throw new Error('Message property must be a string.');
		}
		this._message = val;
		this._template = Hogan.compile(this._message);
	}

	get status() {
		return this._status;
	}

	set status(val) {
		let tmp = parseInt(val);
		if(tmp != val || isNaN(tmp)) {
			throw new Error('Status property must be an integer.');
		}
		this._status = tmp;
	}

	get params() {
		return this._params;
	}

	set params(val) {
		if(val === undefined || val === null) {
			val = {};
		}
		
		if(Object.prototype.toString.call(val) !== '[object Object]') {
			throw new Error('Params property must be an object.');
		}
		this._params = val;
	}
}

Howhap.prototype.prototype = new Error();


module.exports = Howhap;