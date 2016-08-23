/**
 * Updates the state based on the object and informs the VideoWrapper of state changes
 *
 * @providesModule UpdateState
 * @private
 * @internal
 * @flow
 *
 * @param {Object} updateObject State changes that need to be processed
 * @param {Array<string>} videoFunc changes that should be applied to the video
 * @param {boolean} force Force the updates, skips the intersection logic
 */

import Listener from './listener';
import Store from './Store';
import { checkForUnmappedUpdates } from './Warnings';

let pendingUpdate = false;
let updatePaths = [];

export default function updateState(
  mapStateToProps:Function,
  stateUpdateObject:Object,
  componentName:string,
) : void {
  let emitListener:boolean = false;

  const mappedStateToProps = mapStateToProps();

  if (process.env.NODE_ENV !== 'production') {
    checkForUnmappedUpdates(mappedStateToProps, stateUpdateObject, componentName);
  }

  for (const stateKeyToUpdate:string in stateUpdateObject) {
    if (!stateUpdateObject.hasOwnProperty(stateKeyToUpdate)) {
      continue;
    }

    emitListener = true;

    // track the updatePaths
    updatePaths.push(
      mappedStateToProps[stateKeyToUpdate]
    );

    // optimistically update our store
    Store.setState(
      mapStateToProps,
      stateKeyToUpdate,
      stateUpdateObject[stateKeyToUpdate]
    );
  }

  /*
   * only emit listener if an actual change was made to the store
   * This is a perf optimization to only do react diffs when an intentional
   * change was made
   */
  if (emitListener && !pendingUpdate) {
    pendingUpdate = true;
    window.requestAnimationFrame(() => {
      pendingUpdate = false;

      Listener.getListener()(
        { ...Store.getState() },
        updatePaths
      );
      updatePaths = [];
    });
  }
}

