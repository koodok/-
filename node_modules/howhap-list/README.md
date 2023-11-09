# howhap list

`npm install --save howhap-list`

Stores a list of [howhap](https://github.com/alarner/howhap) errors for easy manipulation and display.

## Usage

```js
let HowhapList = require('howhap-list');

let list = new HowhapList({
	default: {
		message: 'An unknown error occurred',
		status: 500
	},
	email: {
		message: '{{email}} is an invalid email address',
		status: 400,
		params: {
			email: 'foo'
		}
	}
});
```

## Constructor

```js
let list = new HowhapList(errors, options);
```

Both errors and options are optional. Errors can be a plain vanilla javascript object that represents the list of keyed errors.

## Methods

### HowhapList.add(messageAndStatus, params, key)

Adds a new error to the list. The key defaults to 'default'. Below are some examples...

##### messageStatus can be an object
```js
list.add({
	message: '{{email}} is an invalid email address',
	status: 400
}, {email: 'foo'}, 'email');

// RESULT:
/*
{
	email: {
		message: '{{email}} is an invalid email address',
		status: 400,
		params: {
			email: 'foo'
		}
	}
}
*/
```

##### messageStatus can be a string if the availableErrors option is supplied
```js
list.add('AUTH.INVALID_EMAIL', {params: email: 'foo'}, 'email');

// RESULT:
/*
{
	email: {
		message: '{{email}} is an invalid email address',
		status: 400,
		params: {
			email: 'foo'
		}
	}
}
*/
```

##### neither params nor key are required
```js
list.add('AUTH.INVALID_EMAIL');

// RESULT:
/*
{
	email: {
		message: '{{email}} is an invalid email address',
		status: 400
	}
}
*/
```

##### params can be supplied with out a key. The key will default to 'default'
```js
list.add('AUTH.INVALID_EMAIL', {email: 'foo'});

// RESULT:
/*
{
	default: {
		message: '{{email}} is an invalid email address',
		status: 400,
		params: {
			email: 'foo'
		}
	}
}
*/
```

##### key can be supplied with out a params. The params will default to an empty object
```js
list.add('AUTH.INVALID_EMAIL', 'email');

// RESULT:
/*
{
	email: {
		message: '{{email}} is an invalid email address',
		status: 400,
        params:{}
	}
}
*/
```

### HowhapList.remove(key)

Removes an error by its key.

```js
list.remove('default');
```

### HowhapList.toJSON()

Returns a JSON representation of the howhap list with error objects rendered to strings.

```js
let plainObject = list.toJSON();
```

### HowhapList.toObject()

Returns a JSON representation of the howhap list with error objects preserved.

```js
let plainObject = list.toObject();
```

### HowhapList.display(key)

Displays a specific error based on its (optional) key

```js
let list = new HowhapList({
	default: {
		message: 'An unknown error occurred',
		status: 500
	},
	email: {
		message: '{{email}} is an invalid email address',
		status: 400,
		params: {
			email: 'foo'
		}
	}
});

list.display(); // 'An unknown error occurred
list.display('default'); // 'An unknown error occurred
list.display('email'); // foo is an invalid email address
```

## Options

### options.availableErrors

`availableErrors` can hold an objet of errors that can be easily added to the list. For example:

```js
// Errors are defined once in the options argument
let list = new HowhapList(null, {
	availableErrors: {
    	API: {
        	UNKNOWN: {
            	message: 'An unknown error occurred.',
                status: 500
            },
        	NOT_FOUND: {
            	message: 'The model with id {{id}} was not found.',
                status: 404
            },
            PERMISSION_DENIED: {
            	message: 'You don\'t have permission to {{action}} the resource {{resource}}',
                status: 401
            }
        },
        EMAIL: {
        	UNREACHABLE: {
            	message: 'The email address {{email}} is unreachable.',
                status: 400
            }
        }
    }
});

// Errors can be easily added via a string

list.add('API.UNKNOWN');
list.add('API.NOT_FOUND', {id: 7});
list.add('EMAIL.UNREACHABLE', {email: 'test@test.com'});
```

### options.logger

`logger` is an object that will be called each time an error is added. Works natively with [bunyan](https://github.com/trentm/node-bunyan) but you can also add your own logger. It should adhere to the following interface (for example):

```js
let logger = {
	debug: function(message, status, params) {
    	console.log('DEBUG:', message, status, params);
    },
    warn: function(message, status, params) {
    	console.log('WARN:', message, status, params);
    },
    error: function(message, status, params) {
    	console.log('ERROR:', message, status, params);
    }
};
```

Here's an example of how to configure your logger.

```js
let bunyan = require('bunyan');
let HowhapList = require('howhap-list');

let list = new HowhapList(null, {
	logger: bunyan.createLogger({name: "myapp"})
});
```