import { wrap } from 'coflux';
import React from 'react';

function Product({ product, actions }) {
  return (
    <button onClick={actions.buy}>{`Buy ${product.title}!`}</button>
  );
}

export default wrap(Product, {
  mapStateToProps({store, params}) {
    return {
      product: `pharmacy.products.${params.id}`,
    }
  },

  actions: {
    buy({ router }, next) {
      alert('product bought!');
      router.push('/');
    }
  }
});
