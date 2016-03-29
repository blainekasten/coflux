import { Provider } from 'coflux';
import { Router, browserHistory, Route } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import EmailApp from './EmailApp';
import EmailList from './EmailList';
import Email from './Email';

// must have a default store
// would be awesome to integrate with webpack and flow
// and use flow to validate the store tree
const store = {
  user: {
    firstName: 'Blaine',
    lastName: 'Kasten',
  },
  emails: [
    {from: 'Agent<foo@gmail.com>', subject: 'I rendered this easily', message: 'lorem ipsum foo bar dude', id: 'ab23'},
    {from: 'ange<italy@gmail.com>', subject: 'Colocation ftw', message: 'Dude. Secret message here yo bro', id: 'cd92'},
  ],

  focusedEmail: null,
};

ReactDOM.render(
  <Provider store={store}>
    <EmailApp>
      <Router component={EmailApp} history={browserHistory}>
        <Route path="/" component={EmailList}/>
        <Route path="/email/:id" component={Email} />
      </Router>
    </EmailApp>
  </Provider>,
  document.querySelector('#app')
);
