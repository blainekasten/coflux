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

import { listener } from './listener';
import { setState, store } from './Store';
// import intersection from './intersection';

let pendingUpdate = false;
let updatePaths = [];

export default function updateState(
  mapStateToProps:Object,
  stateUpdateObject:Object,
) : void {
  // const stateUpdateObject:Object = intersection(updateObject, resolvePath(store)[resolveKey]);
  let emitListener:boolean = false;

  const mappedStateToProps = mapStateToProps();

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
    setState(
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
    requestAnimationFrame(() => {
      pendingUpdate = false;

      listener(
        {...store},
        updatePaths
      );
      updatePaths = [];
    });
  }
}

