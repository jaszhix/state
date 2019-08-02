# state

This is a small state management library that handles dispatching callbacks on state change, or manual triggers. Simplicity and performance are the main priorities for this library.

## Install

- `yarn add @jaszhix/state`

## Examples

### Basic Usage

```js
import init from '@jaszhix/state';

// Initialize the store
const state = init({foo: null});

// Setup the callback for 'foo' value change
const id = state.connect('foo', ({foo}) => {
  // Handle this property's value change
  console.log(foo); // 'bar'
});

state.set({foo: 'bar'});

// Later in the application lifecycle (e.g., when a component unmounts), you can disconnect the key from the callback queue.
state.disconnect(id);
```

### Manual Triggers

```js
import init from '@jaszhix/state';

// Initialize the store
const state = init({foo: null});

// Setup the callback for 'foo' value change
const id = state.connect({
  action1: (bool) => {
    // Handle the action
    console.log(bool); // true
  }
});

state.trigger('action1', true);
```

Check src/index.test.ts for more examples.

## Contributing

- `yarn`
- `yarn build`
- `yarn start`
