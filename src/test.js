import React from 'react';
import Provider from './Provider';

export default function unwrapCofluxComponent(Component, mockStore) {
  return function TestComponent() {
    return (
      <Provider store={mockStore}>
        <Component />
      </Provider>
    );
  }
}
