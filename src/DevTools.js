/*
 * Copyright 2016 Blaine Kasten
 * All rights reserved.
 *
 * Licensed under the MIT License.
 *
 * @providesModule DevTools
 * @flow
 */

import updateState from './updateState';

const devtoolsAvailable = (
  process.env.NODE_ENV !== 'production' &&
  typeof window !== undefined &&
  window.devToolsExtension
);

let devtool = {};
let unsubscribe;

export default {
  connect(state) {
    if (devtoolsAvailable) {
      devtool = window.devToolsExtension.connect({
        name: 'Coflux DevTools',
        instanceId: 1,
      });

      devtool.init(state);

      unsubscribe = devtool.subscribe(message => {
        if (message.type !== 'DISPATCH' || message.payload.type !== 'JUMP_TO_STATE') {
          return;
        }

        const state = JSON.parse(message.state);

        updateState(() => state.mappedProps, state.update, 'DevTools');
      })
    }
  },

  send(type, state) {
    if (devtoolsAvailable) {
      devtool.send(type, state);
    }
  },

  disconnect() {
    if (devtoolsAvailable) {
      devtool = window.devToolsExtension.disconnect();
    }
  }
}
