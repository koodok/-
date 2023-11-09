# Houston, we have a problem

Howhap is a small library for dealing with parameterized errors.

`npm install --save howhap`

```js
let Howhap = require('howhap');

// Each error needs a message and a status code.
let authError = new Howhap({
	message: 'Please enter a password.',
	status: 400
});

// Errors can also use simple templating
let emailError = new Howhap({
	message: '"{{ email }}" is not a valid email.',
	status: 400
}, { email: 'fake' });

// You can display error messages as a string
emailError.toString(); // "fake" is not a valid email

// Or JSON
emailError.toJSON();
/*
 * {
 *	  message: '"{{ email }}" is not a valid email.',
 *	  status: 400,
 *	  params: { email: 'fake' }
 * }
 */
```

## Properties

##### message

type: string

```js
	err.message = 'Something went wrong {{ e }}';
```
##### status

type: integer or string representation of an integer

```js
	err.status = 400;
	err.status = '500';
```
##### params

type: object

```js
	err.params = { e: 'foo' };
	
```

## Methods

##### Howhap.prototype.toString()

returns: a string representation of the error with parameters replaced.

```js
let err = new Howhap(
	{message: '{{ x }} went wrong', status: 500},
	{ x: 'a thing' }
);
console.log(err.toString()); // 'a thing went wrong'
```

##### Howhap.prototype.toJSON()

returns: an object representation of the error.

```js
let err = new Howhap(
	{message: '{{ x }} went wrong', status: 500},
	{ x: 'a thing' }
);
console.log(err.toJSON());
// {
//     message: '{{ x }} went wrong',
//     status: 500,
//     params: { x: 'a thing' }
// }
```

##### Howhap.prototype.set(obj)

obj: an object with message, status and params properties.

sets all error properties (message, status, params) in one function call.

```js
let err = new Howhap(
	{message: '{{ x }} went wrong', status: 500},
	{ x: 'a thing' }
);
err.set({
	message: '{{ model }} was not found',
	status: 404,
	params: { model: 'User' }
})
console.log(err.toJSON());
// {
//     message: '{{ model }} was not found',
//     status: 404,
//     params: { model: 'User' }
// }
console.log(err.toString()); // User was not found
```