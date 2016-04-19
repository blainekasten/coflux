# API

## `Provider`

Provider is a HoC for React to provide a single store for your
application. It takes a property of `store` which is the default state
of the store when it initializes.

> **NOTE**
> Future, this will be removed in favor of a babel plugin to infer the
> store's structure and help maintain store shape during runtime.

```js
ReactDOM.render(
  <Provider state={defaultStateObject}>
    {...myApp}
  </Provider>,
  domNode
);
```

## `wrap`

This is the beautiful part of coflux. All of your app is designed
around components that are `wrap`ped. `wrap` takes 2 parameters,
the component, and a flux config.

```js
wrap(MyComponent:React.DOM, fluxConfig:Object);
```

Generally speaking, `MyComponent` can almost always be a stateless
component. The only exceptions should be for local UI state
(visible/hidden, wide/small, etc).


#### `fluxConfig`

`fluxConfig` has a few options currently. This list may or may not expand.

##### `mapStateToProps(state)`

This method is similar to redux with a slight caveat. Effectively you are wanting
to give coflux a path to the state location instead of the actual value.

```js
mapStateToProps(state) {
  return {
    firstName: 'user.firstName',
    lastName: 'user.lastName',
    id: 'user.id',
    loggedIn: 'user.loggedIn',
  }
}
```

A current copy of `state` is passed into this method if you ever need to
do string interpolation based on values in the state. This is not a
garaunteed API. I think it might not be needed.

As the method sounds, these then become props to the function.

```js
function User(props) {
  console.log(props.firstName);
  console.log(props.lastName);

  return <div>{props.firstName} {props.lastName}</div>;
}
```

##### `actions`

This is an object of methods that effectively act as async reducers.

```js
{ actions: {
  logOut(props, next) {
    asyncActionToLogOut(props.id).then(response => {
      next({loggedIn: false});
    });
  }
}}
```

Actions get 2 arguments. the props from `mapStateToProps` and a method named `next`.

`next` takes an object that reduces the values into state and causes refreshes. `next` is not required to be called. An action can do somethign that doesn't affect global state.But when you call `next`, you are triggering the Coflux Diff Algorythm. Which is effectively a fancy way of only updating the components that are "listening" to the state that changes.

Actions then come in as a prop again. Building on the previous example:

```js
function User(props) {
  const logOut = props.actions.logOut;

  return (
    <div>
      ...
      <button onClick={logOut}>Log Out</button>
    </div>
  );
}
```

So all together we get something like this:


```js
// User Component
import React from 'react';
import { wrap } from 'coflux';

function User(props) {
  const {
    actions: { logOut },
    firstName,
    lastName,
  } = props;

  return (
    <div>
      <div>{props.firstName} {props.lastName}</div>;
      <button onClick={logOut}>Log Out</button>
    </div>
  );
}

export default wrap(User, {
  mapStateToProps() {
    return {
      firstName: 'user.firstName',
      lastName: 'user.lastName',
      id: 'user.id',
      loggedIn: 'user.loggedIn',
    };
  },

  actions: {
    logOut(props, next) {
      asyncActionToLogOut(props.id).then(response => {
        next({loggedIn: false});
      });
    },
  },
}
```

## `unwrap`

This method is used to test your components. It effectively lets you
mock the store for a component

```js
import WrappedComponent from '../';
import { unwrap } from 'coflux';

const Component = unwrap(WrappedComponent, { user: {
  firstName: 'foo',
  lastName: 'bar',
  id: 123,
  loggedIn: true,
});

const inst = <Component />;
```
