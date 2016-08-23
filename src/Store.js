/*
 * Copyright 2016 Blaine Kasten
 * All rights reserved.
 *
 * Licensed under the MIT License.
 *
 * @providesModule Store
 * @flow
 */

import crawlObject from 'object-crawl';

let _store:Object;

// try {
  // _store = STORE;
// } catch (e) {
  // throw error about not using the babel-compiler
// }

export default {
  getState() : Object {
    return _store;
  },

  injectStore(store:Object) : Object {
    _store = { ...store };
    return _store;
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
