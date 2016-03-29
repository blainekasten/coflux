/*
 * @flow
 */
import crawlObject from './crawlObject';

let _store = {};

export default {
  get store() { return _store; },

  injectStore(store) {
    _store = {...store};
  },

  setState(mapStateToProps:Function, key:string, value:any) : void {
    let parentNode = _store;
    const path = mapStateToProps()[key];
    const pathsSplit = path.split('.');
    const pathSplicedLastKey = pathsSplit.splice(pathsSplit.length - 1, 1);

    /*
     * if the path is a first index, then we
     * don't need to crawl the object, as the parentNode
     * will be the store
     */
    if (pathsSplit.length >= 1) {
      parentNode = crawlObject(_store, pathsSplit.join('.'));
    }

    parentNode[pathSplicedLastKey] = value;
  },
};
