/**
 * @providesModule Warnings
 * @private
 * @internal
 * @flow
 */

import invariant from 'invariant';

/*
 * Checks if a component is trying to update an state key is does not have mapped.
 */
export function checkForUnmappedUpdates(mappedState, stateUpdateRequests, componentName) {
  Object.keys(stateUpdateRequests).forEach(key => {
    invariant(
      mappedState[key],
      `You are trying to update a state key, "${key}" that is not mapped in your component, ${componentName}.` // eslint-disable-line max-len
    );
  });
}

