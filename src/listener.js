/**
 * @providesModule Listener
 * @providesModule flow
 */

let _listener: Function = () => {};

export default {
  get listener() : Function {
    return _listener;
  },
  listen(fn: Function) : void {
    _listener = fn;
  },
};
