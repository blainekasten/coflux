/*
 * @providesModule unwrapComponent
 * @flow
 */

import React from 'react';
import Provider from './Provider';

export default function unwrapCofluxComponent(Component, mockStore) {
  // TODO: Add invariant call if `mockStore`
  // is not provided.

  return function TestComponent() {
    return (
      <Provider store={mockStore}>
        <Component />
      </Provider>
    );
  };
}
