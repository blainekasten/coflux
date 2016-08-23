/*
 * Copyright 2016 Blaine Kasten
 * All rights reserved.
 *
 * Licensed under the MIT License.
 *
 * @providesModule unwrapComponent
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
