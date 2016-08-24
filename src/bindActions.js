/*
 * Copyright 2016 Blaine Kasten
 * All rights reserved.
 *
 * Licensed under the MIT License.
 *
 * @providesModule bindActions
 * @flow
 */

import updateState from './updateState';
import DevTools from './DevTools';

export type ActionFn = (stateSlice:Object, nextFn:Function, ...args:any) => Object

export type ActionBindings = {
  [key: string]: ActionFn,
};

export default function bindActions(
  actions:Object,
) : Object {
  const boundActions = {};

  function updateStateCallback(actionName:string, updateObject:Object) : any {
    const mapStateToProps = this.props.mapStateToProps.bind(null, this.context.state);


    DevTools.send(this.name() + '#' + actionName, {
      mappedProps: mapStateToProps(),
      update: updateObject,
    });

    return updateState(
      mapStateToProps,
      updateObject,
      this.name(),
    );
  }

  function createBindings(action:string) : Function {
    return (...args) =>
      actions[action](
        { ...this.propsForComponent() },
        updateStateCallback.bind(this, action),
        ...args,
      );
  }

  for (const actionName in actions) {
    /* istanbul ignore if */
    if (!actions.hasOwnProperty(actionName)) {
      continue;
    }

    boundActions[actionName] = createBindings.call(this, actionName);
  }

  return boundActions;
}
