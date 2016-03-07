/*
 * @flow
 */
import crawlObject from './crawlObject';

let _store = {};

export default {
  get store() { return _store; },

  injectStore(store) {
    _store = {...store};
    _store.__loadedPathsMap = {};
  },

  loadedForPath(path) {
    _store.__loadedPathsMap[path] = true;
  },

  setState(mapStateToProps:Function, key:string, value:any) : void {
    const path = mapStateToProps()[key];
    const pathsSplit = path.split('.');
    const pathSplicedLastKey = pathsSplit.splice(pathsSplit.length - 1, 1);
    const parentNode = crawlObject(_store, pathsSplit.join('.'))

    parentNode[pathSplicedLastKey] = value;
  },
};
