# coflux
Flux at the Component Level.

Coflux was built to make your components COMPLETELY autonomous
in both appearance and data. This steals from the ideas of Relay and
Redux and brings new performance benefits previously not possible.

### [Documentation](https://github.com/blainekasten/coflux/tree/master/docs)


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
  domNode
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
