let expect = require('chai').expect;
let HowhapList = require('../src/index');
describe('HowhapList', function() {
	let startingErrors = {
		default: {
			message: 'Something went wrong',
			status: 500,
			params: {}
		},
		email: {
			message: '"{{ email }}" is not a valid email.',
			status: 400,
			params: {
				email: 'test@test.com'
			}
		},
		form: {
			message: 'Default form error',
			status: 500,
			params: {}
		}
	};

	describe('constructor', function() {
		it('should enforce that errors is an object', function() {
			expect(() => { new HowhapList('foo'); }).to.throw('errors must be an object');
			expect(() => { new HowhapList(7); }).to.throw('errors must be an object');
		});

		it('should enforce options.availableErrors is an object', function() {
			expect(() => { new HowhapList(null, {availableErrors: 7}); }).to.throw('options.availableErrors must be an object');
			expect(() => { new HowhapList(null, {availableErrors: 'test'}); }).to.throw('options.availableErrors must be an object');
		});

		it('should enforce that options.logger is a function', function() {
			expect(() => { new HowhapList(null, {logger: 7}); }).to.throw('options.logger must be an object');
			expect(() => { new HowhapList(null, {logger: 'test'}); }).to.throw('options.logger must be an object');
		});

		it('should work with no params', function() {
			expect(() => { new HowhapList(); }).to.not.throw();
		});

		it('should store any passed in errors', function() {
			let l = new HowhapList({
				default: {
					message: 'This is an error message',
					status: 404
				}
			});
			expect(l.errors.default.message).to.equal('This is an error message');
			expect(l.errors.default.status).to.equal(404);
		});
	});

	describe('add', function() {
		let l = new HowhapList(
			null,
			{
				availableErrors: {
					default: {
						message: 'Something went wrong',
						status: 500
					},
					email: {
						message: '"{{ email }}""  is not a valid email.',
						status: 400
					},
					form: {
						default:  {
							message: 'Default form error',
							status: 500
						}
					}
				}
			}
		);

		it('should not allow errors that strings with no matching property', function() {
			expect(() => { l.add('test'); }).to.throw('Could not find an error with descriptor test');
		});

		it('should allow valid objects', function() {
			expect(() => { l.add({ message: 'foo', status: 400 }); }).to.not.throw();
		});

		it('should not allow invalid objects', function() {
			expect(() => { l.add({ message: 'foo' }); }).to.throw('First argument to Howhap constructor must contain a status property.');
		});

		it('should allow valid strings', function() {
			expect(() => { l.add('default'); }).to.not.throw();
			expect(() => { l.add('form.default'); }).to.not.throw();
		});

		it('should work when adding multiple errors with different keys', function() {
			l.add('default', 'key1');
			expect(l.toObject().key1.message).to.equal('Something went wrong');
			l.add('form.default', 'key2');
			expect(l.toObject().key1.message).to.equal('Something went wrong');
			expect(l.toObject().key2.message).to.equal('Default form error');
		});
	});

	describe('remove', function() {
		let startingErrors = {
			default: {
				message: 'Something went wrong',
				status: 500,
				params: {}
			},
			email: {
				message: '"{{ email }}""  is not a valid email.',
				status: 400,
				params: {
					email: 'test@test.com'
				}
			},
			form: {
				message: 'Default form error',
				status: 500,
				params: {}
			}
		};
		it('should allow remove errors by their key', function() {
			let l = new HowhapList(startingErrors);
			l.remove('default');
			expect(l.toJSON().default).to.be.undefined;
			expect(startingErrors.default, 'it should be pure').not.to.be.undefined;
		});
	});

	describe('toJSON', function() {
		it('should respond with formatted errors', function() {
			let l = new HowhapList(startingErrors);
			expect(l.toJSON()).to.deep.equal({
				default: 'Something went wrong',
				email: '"test@test.com" is not a valid email.',
				form: 'Default form error'
			});
		});
		it('should work when an error is added', function() {
			let l = new HowhapList();
			l.add({
				message: 'Test error {{ what }}',
				status: 400
			}, { what: 'foo' }, 'foo');
			expect(l.toJSON()).to.deep.equal({
				foo: 'Test error foo'
			});
		});	
	});
	describe('toObject', function() {
		it('should respond with what it was given in the constructor if no changes are made', function() {
			let l = new HowhapList(startingErrors);
			expect(l.toObject()).to.deep.equal(startingErrors);
		});
		it('should work when an error is added', function() {
			let l = new HowhapList();
			l.add({
				message: 'Test error',
				status: 400
			}, 'foo');
			expect(l.toObject()).to.deep.equal({
				foo: {
					message: 'Test error',
					status: 400,
					params: {}
				}
			});
		});	
	});
	describe('display', function() {
		it('should be able to display an error by key', function() {
			let l = new HowhapList(startingErrors);
			expect(l.display('email')).to.equal('"test@test.com" is not a valid email.');
		});
	});
});