/*
 * THINGS TO THINK ABOUT
 *  - Testing
 *    should be able to import the file, call it and grab `nativeComponent`
 *      ```js
 *      import productList from '../ProductList';
 *      const ProductList = productList().nativeComponent;
 *      ```
 *
 *  - Components should only be able to modify data they specify, not doing this
 *    would be breaking a best practice
 *      - should this be a best practice?
 *      - Does it work for all use cases?
 */

import React from 'react';
import { wrap } from 'coflux';
import ProductItem from './Item';

function ProductList({ products, actions }) {
  return (
    <div>
      {products.map((props, index) => (
        <ProductItem onHover={actions.onHover.bind(null, index)} key={index} index={index} {...props} onDelete={actions.delete.bind(null, index)} />
      ))}
    </div>
  );
}

export default wrap(ProductList, {
  fetch(context) {
    return fetch('/api/products').
      then(resp => resp.json()).
      then(products => ({products}));
  },

  loadingDOM() : React.DOM {
    return <div>Loading...</div>;
  },

  actions: {
    onHover({products}, next, index, e) {
      products[index].focused = true;

      next({products});
    },

    delete({products}, next, index, e) {
      e.preventDefault();
      products.splice(products.indexOf(products[index]), 1);

      next({ products });
    }
  },

  mapStateToProps() {
    return {
      products: 'pharmacy.products',
    }
  },
});
