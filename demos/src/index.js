import { Router } from 'coflux';
import { browserHistory, Route } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import Pharmacy from './Pharmacy';
import Product from './Product';
import ProductList from './ProductList';

const store = {
  pharmacy: {
    products: [],
  },
  user: {
    firstName: 'Blaine',
    lastName: 'Kasten',
  },
};

ReactDOM.render(
  <Router component={Pharmacy} store={store} history={browserHistory}>
    <Route path="/" component={ProductList}/>
    <Route path="product/:id" component={Product} />
  </Router>,
  document.querySelector('#app')
);
