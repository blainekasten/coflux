# coflux
Flux at the Component Level.

[![Circle
CI](https://circleci.com/gh/blainekasten/coflux.svg?style=svg)](https://circleci.com/gh/blainekasten/coflux)
[![npm version](https://img.shields.io/npm/v/coflux.svg)](https://www.npmjs.com/package/coflux)



App state is simply a dependency of your components. Coflux was built to make your components define it's own dependencies, and handle it's own UI and actions. This steals from some ideas of Redux with a different implementation and brings new performance benefits previously not possible.

### [Documentation](https://blainekasten.gitbooks.io/coflux/content/)


### Example
```js
// app.js

import { Provider } from 'coflux';
import User from '../User';

const defaultStore = {
  user: {
    firstName: 'foo',
    lastName: 'bar',
    id: 123,
    loggedIn: true,
  },
};

ReactDOM.render(
  <Provider store={defaultStore}>
    <User />
  </Provider>,
  document.querySelector('#app')
);
```


```js
// User.js
import { wrap } from 'coflux';

function User({firstName, lastName, actions}) {
  return (
    <div>
      <div>{firstName} {lastName}</div>;
      <button onClick={actions.logOut}>Log Out</button>
    </div>
  );
}

export default wrap(UserComponent, {
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
});
```

### Roadmap
*Not particularily in execution order..*

1. Middleware support [(#1)](https://github.com/blainekasten/coflux/issues/1)
2. BabelPlugin for masking `_` prop api. [(#2)](https://github.com/blainekasten/coflux/issues/2)
3. BabelPlugin for infering store structure. [(#3)](https://github.com/blainekasten/coflux/issues/3)
4. DevTooling [(#4)](https://github.com/blainekasten/coflux/issues/4)
