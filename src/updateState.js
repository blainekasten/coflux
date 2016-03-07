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
import intersection from './intersection';

let pendingUpdate = false;

export default function updateState(
  mapStateToProps:Object,
  stateUpdateObject:Object,
) : void {
  //const stateUpdateObject:Object = intersection(updateObject, resolvePath(store)[resolveKey]);
  let emitListener:boolean = false;

  for (const stateKeyToUpdate:string in stateUpdateObject) {
    if (stateUpdateObject.hasOwnProperty(stateKeyToUpdate)) {
      emitListener = true;

      // optimistically update our store
      setState(
        mapStateToProps,
        stateKeyToUpdate,
        stateUpdateObject[stateKeyToUpdate]
      );
    }
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
        store
        // this is causing a deep issue where an injection in a constructor
        // doesn't affect the state it will receive in its render and can
        // cause Errors accessing properties on state that aren't in that copy
        //
        // i'm not sure I like this change
        // but not sure of a better option at this point...
        // adding ImmutableJS would only make that harder.
        //
        // assign({}, state)
      );
    });
  }
}

