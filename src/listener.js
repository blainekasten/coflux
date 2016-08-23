/*
 * Copyright 2016 Blaine Kasten
 * All rights reserved.
 *
 * Licensed under the MIT License.
 *
 * @providesModule Listener
 * @flow
 */

let _listener: Function = () => {};

export default {
  getListener() : Function {
    return _listener;
  },

  listen(fn: Function) : void {
      _listener = fn;
  }
}
