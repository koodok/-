let expect = require('chai').expect;
let Howhap = require('../src/index.js');
describe('Howhap', function() {
	describe('errors', function() {
		it('should not allow non-objects for the first parameter of the constructor', function() {
			expect(() => { new Howhap(); })
				.to.throw('First argument to Howhap constructor must be an object.');

			expect(() => { new Howhap('test'); })
				.to.throw('First argument to Howhap constructor must be an object.');

			expect(() => { new Howhap(['array']); })
				.to.throw('First argument to Howhap constructor must be an object.');

			expect(() => { new Howhap(function() {}); })
				.to.throw('First argument to Howhap constructor must be an object.');
		});

		it('should require the first argument to have a message property', function() {
			expect(() => { new Howhap({}); })
				.to.throw('First argument to Howhap constructor must contain a message property.');

			expect(() => { new Howhap({foo: 'test'}); })
				.to.throw('First argument to Howhap constructor must contain a message property.');

			expect(() => { new Howhap({status: 400}); })
				.to.throw('First argument to Howhap constructor must contain a message property.');
		});

		it('should require the first argument to have a status property', function() {
			expect(() => { new Howhap({message: 'test'}); })
				.to.throw('First argument to Howhap constructor must contain a status property.');

			expect(() => { new Howhap({message: 'foo', blah: 'yes'}); })
				.to.throw('First argument to Howhap constructor must contain a status property.');

			expect(() => { new Howhap({message: '123'}); })
				.to.throw('First argument to Howhap constructor must contain a status property.');
		});

		it('should require that the message property is a string', function() {
			expect(() => { new Howhap({message: false, status: 400}); })
				.to.throw('Message property must be a string.');

			expect(() => { new Howhap({message: 7, status: 400}); })
				.to.throw('Message property must be a string.');

			expect(() => { new Howhap({message: [], status: 400}); })
				.to.throw('Message property must be a string.');

			expect(() => { new Howhap({message: {}, status: 400}); })
				.to.throw('Message property must be a string.');
		});

		it('should require that the status property is an integer or a string representation of an integer', function() {
			expect(() => { new Howhap({message: 'msg', status: false}); })
				.to.throw('Status property must be an integer.');

			expect(() => { new Howhap({message: 'msg', status: []}); })
				.to.throw('Status property must be an integer.');

			expect(() => { new Howhap({message: 'msg', status: {}}); })
				.to.throw('Status property must be an integer.');

			expect(() => { new Howhap({message: 'msg', status: '400'}); })
				.not.to.throw();

			expect(() => { new Howhap({message: 'msg', status: 12.1}); })
				.to.throw('Status property must be an integer.');

			expect(() => { new Howhap({message: 'msg', status: '12.1'}); })
				.to.throw('Status property must be an integer.');
		});

		it('should require that params be empty or an object', function() {
			expect(() => { new Howhap({message: 'msg', status: 400}, 123); })
				.to.throw('Params property must be an object.');

			expect(() => { new Howhap({message: 'Hello {{ world }}', status: 404}, false); })
				.to.throw('Params property must be an object.');

			expect(() => { new Howhap({message: 'This is a test', status: 500}, 'test'); })
				.to.throw('Params property must be an object.');

			expect(() => { new Howhap({message: 'Bad gateway', status: 502}, [1,2,3]); })
				.to.throw('Params property must be an object.');

			expect(() => { new Howhap({message: 'Bad gateway', status: 502, params: 'foo'}); })
				.to.throw('Params property must be an object.');
		});

		it('should accept valid input', function() {
			expect(() => { new Howhap({message: 'msg', status: 400}); })
				.to.not.throw();

			expect(() => { new Howhap({message: 'Hello {{ world }}', status: 404}); })
				.to.not.throw();

			expect(() => { new Howhap({message: 'This is a test', status: 500}); })
				.to.not.throw();

			expect(() => { new Howhap({message: 'Bad gateway', status: 502}); })
				.to.not.throw();
		});

		it('should allow conversion to json', function() {
			let data = {message: 'Bad gateway', status: 502, params: {foo: 'bar'}};
			let x = new Howhap(data);
			expect(x.toJSON()).to.deep.equal(data);

			let y = new Howhap({message: 'Bad gateway', status: 502}, {foo: 'bar'});
			expect(y.toJSON()).to.deep.equal(data);
		});

		it('should clone params when converting to json', function() {
			let data = {message: 'Bad gateway', status: 502, params: {foo: 'bar'}};
			let x = new Howhap(data);
			let json = x.toJSON();
			json.params.foo = 'baz';
			expect(x.toJSON().params.foo).to.equal('bar');
		});

		it('should allow conversion to a string', function() {
			let data = {message: 'Bad gateway', status: 502, params: {foo: 'bar'}};
			let x = new Howhap(data);
			expect(x.toString()).to.equal('Bad gateway');

			let y = new Howhap({message: 'Bad gateway', status: 502}, {foo: 'bar'});
			expect(y.toString()).to.equal('Bad gateway');
		});

		it('should replace template params', function() {
			let data = {message: 'Bad gateway {{ foo }}', status: 502, params: {foo: 'bar'}};
			let x = new Howhap(data);
			expect(x.toString()).to.equal('Bad gateway bar');

			let y = new Howhap({message: 'Bad gateway {{ foo }} {{ baz }}', status: 502}, {foo: 'baz'});
			expect(y.toString()).to.equal('Bad gateway baz ');
		});

		it('should have a getter for the message property', function() {
			let data = {message: 'Bad gateway {{ foo }}', status: 502, params: {foo: 'bar'}};
			let x = new Howhap(data);
			expect(x.message).to.equal('Bad gateway {{ foo }}');
		});

		it('should have a getter for the message property', function() {
			let data = {message: 'Bad gateway {{ foo }}', status: 502, params: {foo: 'bar'}};
			let x = new Howhap(data);
			expect(x.message).to.equal('Bad gateway {{ foo }}');
		});

		it('should not cause problems when two Howhap objects are created', function() {
			let data = {message: 'Bad gateway {{ foo }}', status: 502, params: {foo: 'bar'}};
			let x = new Howhap(data);

			let data2 = {message: 'Another message', status: 502, params: {foo: 'bar'}};
			let y = new Howhap(data2);
			expect(x.message).to.equal('Bad gateway {{ foo }}');
			expect(y.message).to.equal('Another message');
		});
		it('should should have a name property', function() {
			let data = {message: 'Bad gateway {{ foo }}', status: 502, params: {foo: 'bar'}};
			let x = new Howhap(data);
			expect(x.name).to.be.ok;
		});
	});
});