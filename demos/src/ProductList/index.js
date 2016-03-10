
import React from 'react';
import List from './ProductList';
import ContextualStuff from './ContextualStuff';

export default function ProductList(props, context) {
  return (
    <div>
      <List />
      <ContextualStuff />
    </div>
  );
}
