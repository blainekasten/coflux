/**
 * @providesModule Listener
 * @providesModule flow
 */

let _listener: Function = () => {};

export default {
  get listener() : func {
    return _listener;
  },
  listen(fn: func) : void {
    _listener = fn;
  },
};
