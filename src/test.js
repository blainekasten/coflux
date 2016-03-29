import React from 'react';
import Provider from './PProvider';

export default function testWrapper(Component, user) {
  const builtStore = {
    user,
  };

  return function() {
    return (
      <Provider store={builtStore}>
        <Component />
      </Provider>
    );
  }
}
